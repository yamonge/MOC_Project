import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {RefreshCw, Filter, AlertCircle, X} from 'lucide-react-native';
import PostCard from './PostCard';
import PostFilterModal from './PostFilterModal';
import PostCreateModal from './PostCreateModal';
import ChatRoomScreen from '../chat/ChatRoomScreen';
import {getPostsByLocation, joinPost} from '../../api/map';
import {scheduleMeetingNotification} from '../../utils/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/components/map/PostListBottomSheetStyles';
import {colors} from '../../styles/common';

const PostListBottomSheet = forwardRef(
  (
    {
      visible,
      onClose,
      navigation,
      storeName = '선택된 장소',
      selectedMarker = null,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['30%', '80%'], []);

    /**
     * =========================
     * ✅ 원본 / 렌더링 분리
     * - allPostList: 서버에서 받아온 "원본" (필터 적용 전)
     * - postList   : 화면에 렌더링할 "필터 적용 결과"
     * =========================
     */
    const [allPostList, setAllPostList] = useState([]);
    const [postList, setPostList] = useState([]); // 필터 적용된 리스트(렌더링용)

    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID

    // 게시물 필터 모달 (내부 관리)
    const [showPostFilterModal, setShowPostFilterModal] = useState(false);

    // 필터 상태
    const [postFilters, setPostFilters] = useState({
      ingredients: [],
      peopleCount: null, // ✅ [수정] 초기에는 인원수 필터 미적용
      time: null,
    });

    // 게시물 작성 모달
    const [showPostCreateModal, setShowPostCreateModal] = useState(false);

    // 채팅방 모달
    const [showChatRoom, setShowChatRoom] = useState(false);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [selectedStoreName, setSelectedStoreName] = useState(null);
    const [selectedChatRoomStatus, setSelectedChatRoomStatus] = useState(null);

    // 현재 사용자 정보 로드
    useEffect(() => {
      const loadCurrentUser = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          setCurrentUserId(Number(userId));
        } catch (error) {
          console.error('[현재 사용자 로드 실패]', error);
        }
      };
      loadCurrentUser();
    }, []);

    // visible 변경 시 바텀시트 열기/닫기
    useEffect(() => {
      if (visible) {
        bottomSheetRef.current?.snapToIndex(0);
        setPostFilters({
          ingredients: [],
          peopleCount: null, // ✅ [수정] 초기에는 인원수 필터 미적용
          time: null,
        });

        // 바텀시트 열릴 때 게시물 로드
        if (selectedMarker) {
          loadPosts(); // ✅ 열릴 때 최신 데이터 로드
        }
      } else {
        bottomSheetRef.current?.close();
      }
    }, [visible, selectedMarker]);

    /**
     * 게시물 목록 불러오기
     * DTO → PostCard 모델 매핑 포함
     */
    // meetDatetime -> "HH:mm"
    const formatMeetTime = ts => {
      if (!ts) return '-';
      const d = new Date(ts); // Timestamp가 ISO로 직렬화되면 정상 파싱됨
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // categoryCodesCsv -> "meat 외 2개"
    // 재료 코드 → 한글 라벨 매핑
    const INGREDIENT_LABEL_MAP = {
      meat: '육류',
      dairy: '유제품',
      vegetable: '채소',
      fruit: '과일',
      snack: '간식',
      etc: '기타',
    };

    const formatItems = csv => {
      if (!csv) return '재료 미선택';

      const codes = String(csv)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (codes.length === 0) return '재료 미선택';

      const labels = codes.map(code => INGREDIENT_LABEL_MAP[code] || code);

      // 표기 정책: 1개면 그대로, 여러개면 "첫번째 외 n개"
      return labels.length === 1
        ? labels[0]
        : `${labels[0]} 외 ${labels.length - 1}개`;
    };

    /**
     * =========================
     * ✅ [추가] 필터링용 코드 배열 파싱 함수
     * - DTO의 categoryCodesCsv("meat,dairy")를
     *   ['meat','dairy']로 변환
     * - "표시용(items)"과 "필터용(categoryCodes)"를 분리하기 위함
     * =========================
     */
    const parseCategoryCodes = csv => {
      if (!csv) return [];
      return String(csv)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    };

    const toIso = v => {
      if (!v) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    };
    /**
     * DTO -> PostCard post 모델
     * - PostCard가 기대하는 필드 형태로 변환
     */
    const mapToPostCardModel = (dto, marker) => {
      const distanceKm =
        marker?.distance != null
          ? `${Number(marker.distance).toFixed(1)}km`
          : dto?.distanceMeters != null
          ? `${(Number(dto.distanceMeters) / 1000).toFixed(1)}km`
          : '-';

      return {
        id: dto.shoppingPostId,

        storeName: dto.placeName || marker?.name || '선택된 장소',
        distance: distanceKm,

        // ✅ 화면 표시는 "HH:mm"
        meetTime: formatMeetTime(dto.meetDatetime),

        // ✅ [추가] 시간 필터링 정확도를 위해 원본 meetDatetime도 같이 보관
        // - TimePickerModal은 ISO timestamp를 주므로, 여기서도 ISO를 그대로 저장하면 비교가 쉬움
        meetDatetime: dto.meetDatetime, // ★ 필드 추가(기존 렌더링 영향 없음)

        currentCount: dto.currentPersonCnt ?? 0,
        maxCount: dto.maxPersonCnt ?? 0,

        items: formatItems(dto.categoryCodesCsv),

        // 재료 필터링용 원본 코드 배열
        categoryCodes: parseCategoryCodes(dto.categoryCodesCsv),

        author: dto.writerNickname || `user#${dto.writerUserId ?? ''}`,
        creatorUserId: dto.writerUserId, // ✅ 작성자 ID 추가
        description: dto.description || '',
        createdAt: toIso(dto.createdDate) || new Date().toISOString(),
        statusCd: dto.statusCd || 'OPEN', // ✅ 게시글 상태 추가 (OPEN, DONE, CANCELLED)
        isParticipated: dto.isParticipated || false, // 🔥 서버에서 받은 참여 여부
      };
    };

    /**
     * =========================
     * ✅ [추가] 시간 비교 유틸 (TimePickerModal 구조 반영)
     * - timeData.timestamp 는 ISO 문자열
     * - post.meetDatetime도 ISO/파싱 가능한 값이라고 가정
     * - hideMinutes=true 이므로 "같은 시(hour)"인지 비교
     *
     * 정책:
     * - 날짜까지 완전 일치로 하려면 year/month/day도 비교하면 됨.
     *   (현재 요구사항이 명확히 없어서, 우선 hour + 날짜까지 일치로 구현)
     * =========================
     */
    const isSameDateAndHour = (meetDatetime, filterIso) => {
      const a = new Date(meetDatetime);
      const b = new Date(filterIso);

      if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;

      return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate() &&
        a.getHours() === b.getHours()
      );
    };

    /**
     * =========================
     * ✅ [추가] 필터 적용 함수 (현재 구조에 맞춰 "정확히" 구현)
     * - 재료: post.categoryCodes(코드 배열) vs filters.ingredients(코드 배열) 교집합
     * - 인원수: post.maxCount === filters.peopleCount  (요청사항)
     * - 시간: TimePickerModal timeData.timestamp(ISO)와 post.meetDatetime의 "날짜+시"가 동일한지
     * =========================
     */
    const applyPostFilters = (posts, filters) => {
      if (!Array.isArray(posts)) return [];

      const ingredients = filters?.ingredients || [];
      const peopleCount = filters?.peopleCount;
      const time = filters?.time || null;

      return posts.filter(post => {
        // 1) 재료 필터
        if (ingredients.length > 0) {
          const postCodes = Array.isArray(post.categoryCodes)
            ? post.categoryCodes
            : [];

          const hasAny = ingredients.some(code => postCodes.includes(code));
          if (!hasAny) return false;
        }

        // 2) 인원수 필터 (maxCount 이하)
        if (peopleCount != null) {
          const maxCountNum = Number(post.maxCount);
          if (Number.isNaN(maxCountNum) || maxCountNum <= 0) return false;
          if (maxCountNum > peopleCount) return false; // peopleCount 이하만 표시
        }
        // 3) 시간: 날짜+시 동일 (hideMinutes=true 정책에 가장 자연스러움)
        if (time?.timestamp) {
          if (!post.meetDatetime) return false;
          if (!isSameDateAndHour(post.meetDatetime, time.timestamp))
            return false;
        }

        return true;
      });
    };

    /**
     * ✅ [추가] 원본 리스트 -> 필터 적용 -> 렌더링 리스트 갱신
     */
    const refreshFilteredList = (sourcePosts, filters) => {
      setPostList(applyPostFilters(sourcePosts, filters));
    };

    /**
     * 게시물 목록 불러오기
     */
    const loadPosts = async () => {
      if (!selectedMarker?.latitude || !selectedMarker?.longitude) return;

      try {
        setIsLoading(true);

        // DTO 배열 받아오기
        const fetchedPosts = await getPostsByLocation(
          selectedMarker.name,
          selectedMarker.latitude,
          selectedMarker.longitude,
        );

        // 🔥 디버깅: 서버에서 받은 원본 데이터 확인
        console.log('[API 응답 원본]', fetchedPosts?.length, '개');
        if (fetchedPosts?.length > 0) {
          fetchedPosts.forEach((dto, idx) => {
            console.log(
              `[게시물 ${idx + 1}] ID:${dto.shoppingPostId}, statusCd:${
                dto.statusCd
              }, 장소:${dto.placeName}`,
            );
          });
        }

        /**
         * =========================
         * 서버에서 받아온 "원본"을 allPostList로 저장
         * 그리고 "현재 필터"를 적용해 postList를 갱신
         * =========================
         */
        const mappedPosts = Array.isArray(fetchedPosts)
          ? fetchedPosts
              .filter(Boolean) // ✅ null 제거
              .filter(dto => {
                // 🔥 디버깅: 필터링 과정 로그
                const isOpen = dto.statusCd === 'OPEN';
                if (!isOpen) {
                  console.log(
                    `[필터링 제외] ID:${dto.shoppingPostId}, statusCd:${dto.statusCd} (OPEN 아님)`,
                  );
                }
                return isOpen;
              })
              .map(dto => mapToPostCardModel(dto, selectedMarker))
          : [];

        console.log('[필터링 후]', mappedPosts.length, '개');

        setAllPostList(mappedPosts);
        refreshFilteredList(mappedPosts, postFilters);

        console.log('[게시물 조회 성공]', mappedPosts.length, '개');
      } catch (error) {
        console.error('[게시물 조회 실패]', error);
        setAllPostList([]);
        setPostList([]);
        Alert.alert('오류', '게시물을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    // 🔥 외부에서 새로고침 호출 가능하도록 ref 노출
    useImperativeHandle(ref, () => ({
      refreshPosts: loadPosts,
    }));

    /**
     * 새로고침 핸들러
     */
    const handleRefresh = () => {
      console.log('[게시물 새로고침]', storeName);
      loadPosts(); // ✅ loadPosts 내부에서 현재 필터 기준으로 다시 렌더링됨
    };

    /**
     * 게시물 필터 모달 열기
     */
    const handlePostFilterPress = () => {
      console.log('[게시물 필터 열기]');
      setShowPostFilterModal(true);
    };

    /**
     * =========================
     * ✅ [수정] 게시물 필터 적용 (핵심)
     * - 필터 state 저장
     * - "원본(allPostList)"에 필터 적용
     * - 렌더링(postList) 갱신
     * - 모달 닫기
     * =========================
     */
    const handleApplyPostFilter = filters => {
      setPostFilters(filters);
      console.log('[게시물 필터 적용]', filters);
      // ✅ 원본 리스트에 필터를 적용해서 화면 렌더링 리스트 갱신
      refreshFilteredList(allPostList, filters);

      // ✅ 모달 닫기 (중복 close 방지: PostFilterModal에서는 onClose를 따로 호출하지 않게 수정)
      setShowPostFilterModal(false);

      // 서버 필터링: 필요 시 필터 파라미터로 요청하도록 변경 가능
      /*
    loadPostsWithFilters(filters);
    */
    };

    /**
     * 글쓰기 핸들러
     */
    const handleWritePress = () => {
      console.log('[글쓰기 클릭]', selectedMarker?.name);
      setShowPostCreateModal(true);
    };

    /**
     * 참여하기/채팅방 입장 핸들러
     */
    const handleJoinPost = async post => {
      const isOwner = currentUserId === post.creatorUserId;
      const isParticipant = post.isParticipated; // 🔥 서버에서 받은 값 사용

      console.log('[참여하기/채팅방 입장] 시작', {
        postId: post.id,
        storeName: post.storeName,
        isOwner,
        isParticipant,
        currentCount: post.currentCount,
        maxCount: post.maxCount,
      });

      // ✅ 작성자 또는 이미 참여한 경우: API 호출 없이 채팅방 열기
      if (isOwner || isParticipant) {
        console.log(isOwner ? '[작성자]' : '[참여자]', '채팅방 바로 열기');
        onClose();
        setSelectedChatRoomId(post.id);
        setSelectedStoreName(post.storeName);
        setSelectedChatRoomStatus(post.statusCd || 'OPEN'); // ✅ 상태 설정
        setShowChatRoom(true);
        return;
      }

      // ✅ 인원수 마감 체크 (새로운 참여자만)
      if (post.currentCount >= post.maxCount) {
        Alert.alert('알림', '모집 인원이 마감되었습니다.');
        return;
      }

      try {
        let chatRoomId;

        // ✅ 일반 사용자: joinPost API 호출하여 참여
        console.log('[일반 사용자] joinPost API 호출 시작...');
        const response = await joinPost(post.id);
        console.log('[일반 사용자] joinPost API 응답:', response);

        // ✅ 응답이 숫자 자체인 경우 처리
        if (typeof response === 'number') {
          chatRoomId = response;
        } else {
          chatRoomId = response?.chatRoomId || response?.id || response;
        }

        console.log('[일반 사용자] 참여 완료, chatRoomId:', chatRoomId);

        // 🔥 참여 성공 후 게시물 목록 새로고침 (인원수 + isParticipated 업데이트)
        await loadPosts();

        // 🔔 약속 30분 전 알림 예약
        try {
          if (post.meetDatetime) {
            await scheduleMeetingNotification(
              post.id,
              post.storeName,
              post.meetTime,
              new Date(post.meetDatetime),
            );
            console.log('✅ 약속 30분 전 알림 예약 완료');
          }
        } catch (notifError) {
          console.error('⚠️ 알림 예약 실패 (참여는 성공):', notifError);
        }

        // 바텀시트 닫기
        console.log('[바텀시트] 닫기 시작');
        onClose();

        // ✅ 채팅방 모달 열기
        console.log('[채팅방 모달] 열기 시작', {
          chatRoomId,
          storeName: post.storeName,
          showChatRoom: true,
        });

        setSelectedChatRoomId(chatRoomId);
        setSelectedStoreName(post.storeName);
        setSelectedChatRoomStatus(post.statusCd || 'OPEN'); // ✅ 상태 설정
        setShowChatRoom(true);

        console.log('[채팅방 모달] state 설정 완료');
      } catch (error) {
        console.error('[참여하기/채팅방 입장] 실패:', error);
        console.error('[에러 상세]', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        // ✅ 에러 메시지 구분
        const errorMessage = error.response?.data?.message || error.message;

        if (errorMessage?.includes('인원') || errorMessage?.includes('마감')) {
          Alert.alert('알림', '모집 인원이 마감되었습니다.');
        } else if (
          errorMessage?.includes('이미') ||
          errorMessage?.includes('참여')
        ) {
          // ✅ 이미 참여한 경우 채팅방 바로 열기
          console.log('[중복 참여] 채팅방 바로 열기');
          onClose();
          setSelectedChatRoomId(post.id);
          setSelectedStoreName(post.storeName);
          setShowChatRoom(true);
        } else {
          Alert.alert('오류', '채팅방 입장에 실패했습니다.\n' + errorMessage);
        }
      }
    };

    // 게시물 카드 렌더링
    const renderPostCard = ({item}) => {
      const isOwner = currentUserId === item.creatorUserId;
      const isParticipant = item.isParticipated; // 🔥 서버에서 받은 값 사용

      console.log('[PostCard 렌더링]', {
        currentUserId,
        creatorUserId: item.creatorUserId,
        isOwner,
        isParticipant,
        storeName: item.storeName,
      });

      return (
        <PostCard
          post={item}
          onJoin={handleJoinPost}
          isOwner={isOwner}
          isParticipant={isParticipant}
        />
      );
    };
    // 빈 상태
    const renderEmpty = () => (
      <View style={styles.emptyContainer}>
        <AlertCircle size={48} color={colors.textGray} strokeWidth={1.5} />
        <Text style={styles.emptyText}>해당 위치에 게시물이 없습니다</Text>
      </View>
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        style={styles.bottomSheetContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <X size={20} color={colors.textBlack} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>게시물 목록</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <RefreshCw size={20} color={colors.textBlack} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 선택된 장소 정보 */}
        {selectedMarker && (
          <View style={{paddingHorizontal: 16, paddingBottom: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.textBlack,
              }}>
              {selectedMarker.name || storeName}
            </Text>

            {!!selectedMarker.address && (
              <Text
                style={{marginTop: 4, fontSize: 12, color: colors.textGray}}>
                {selectedMarker.address}
              </Text>
            )}

            {selectedMarker.distance != null && (
              <Text
                style={{marginTop: 4, fontSize: 12, color: colors.textGray}}>
                현재 위치에서 약 {Number(selectedMarker.distance).toFixed(1)}km
              </Text>
            )}
          </View>
        )}

        {/* 필터/글쓰기 버튼 */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handlePostFilterPress}
            activeOpacity={0.7}>
            <Text style={styles.filterText}>필터</Text>
            <Filter size={13.375} color={colors.textGray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.writeButton}
            onPress={handleWritePress}
            activeOpacity={0.8}>
            <Text style={styles.writeButtonText}>글쓰기</Text>
          </TouchableOpacity>
        </View>

        {/* 게시물 리스트 */}
        <BottomSheetFlatList
          data={postList}
          renderItem={renderPostCard}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          contentContainerStyle={styles.postListContent}
          ListEmptyComponent={renderEmpty}
        />

        {/* 게시물 필터 모달 (바텀시트 내부에서 렌더링) */}
        <PostFilterModal
          visible={showPostFilterModal}
          onClose={() => setShowPostFilterModal(false)}
          onApply={handleApplyPostFilter}
          initialFilters={postFilters} // ★ 핵심
        />

        {/* 게시물 작성 모달 */}
        <PostCreateModal
          visible={showPostCreateModal}
          onClose={() => setShowPostCreateModal(false)}
          selectedMarker={selectedMarker}
          storeName={selectedMarker?.name || storeName}
          onCreated={() => {
            setShowPostCreateModal(false);
            loadPosts(); // 생성 후 목록 갱신
          }}
        />

        {/* ✅ 채팅방 모달 */}
        {showChatRoom && selectedChatRoomId && (
          <ChatRoomScreen
            visible={showChatRoom}
            chatRoomId={selectedChatRoomId}
            placeName={selectedStoreName}
            statusCd={selectedChatRoomStatus}
            onClose={() => {
              console.log('[채팅방 닫기] 게시물 목록 새로고침 시작');

              setShowChatRoom(false);
              setSelectedChatRoomId(null);
              setSelectedStoreName(null);
              setSelectedChatRoomStatus(null);

              // 🔥 채팅방 닫을 때 게시물 목록 새로고침 (인원수 업데이트 + 참여 여부 재확인)
              loadPosts();
            }}
          />
        )}
      </BottomSheet>
    );
  },
);

export default PostListBottomSheet;
