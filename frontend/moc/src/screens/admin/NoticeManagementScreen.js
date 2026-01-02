import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit2,
  Trash2,
  Bookmark,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/screens/admin/NoticeManagementStyles';
import {colors} from '../../styles/common';
import IngredientModal from '../../components/common/IngredientModal';
import {getNoticeList, toggleNoticePin, deleteNotice} from '../../api/admin';
import {useFocusEffect} from '@react-navigation/native';

/**
 * 공지사항 관리 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "공지사항 관리" 타이틀
 * - 검색창: 실시간 검색
 * - 새 공지 작성 버튼 (녹색 그라데이션)
 * - 공지사항 목록 (세로 스크롤)
 *   - 고정 뱃지 (선택)
 *   - 제목, 내용 미리보기, 작성일
 *   - 관리 버튼: 고정/해제, 수정, 삭제
 */
export default function NoticeManagementScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 삭제 모달 상태
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  useFocusEffect(
  useCallback(() => {
    loadNotices(); // ✅ 화면에 돌아올 때마다 최신 목록 로드
  }, []),
);

  // 검색어 필터링
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotices(notices);
    } else {
      const filtered = notices.filter(
        notice =>
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredNotices(filtered);
    }
  }, [searchQuery, notices]);

  // 공지사항 목록 로드
  const loadNotices = async () => {
    try {
      const response = await getNoticeList();
      const mapped = (response || []).map(n => ({
        id: n.noticeId, // ✅ noticeId -> id
        title: n.title ?? '',
        content: n.content ?? '', // 목록에 content 없으면 빈값
        isPinned: !!n.pinned, // ✅ pinned -> isPinned
        createdAt: n.createdDate // ✅ createdDate -> createdAt
          ? new Date(n.createdDate)
              .toISOString()
              .slice(0, 10)
              .replaceAll('-', '.')
          : '',
      }));
      setNotices(mapped);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.');
    }
  };

  // Pull to Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotices().finally(() => setRefreshing(false));
  }, []);

  // 고정 토글
  const handleTogglePin = async noticeId => {
    try {
      await toggleNoticePin(noticeId);
      await loadNotices(); // ✅ 다시 가져와서 pinned 정렬까지 반영
      Alert.alert('성공', '고정 상태가 변경되었습니다.');
    } catch (error) {
      console.error('고정 토글 실패:', error);
      Alert.alert('오류', '고정 상태 변경에 실패했습니다.');
    }
  };

  // 삭제 확인
  const confirmDelete = noticeId => {
    setSelectedNoticeId(noticeId);
    setDeleteModalVisible(true);
  };

  // 삭제 실행
  const handleDelete = async () => {
    try {
      await deleteNotice(selectedNoticeId);
      setDeleteModalVisible(false);
      loadNotices();
      Alert.alert('성공', '공지사항이 삭제되었습니다.');
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      Alert.alert('오류', '공지사항 삭제에 실패했습니다.');
    }
  };

  // 공지 카드 렌더링
  const NoticeCard = ({notice}) => (
    <View style={styles.noticeCard}>
      {/* 공지 정보 */}
      <View style={styles.noticeInfo}>
        {/* 제목 & 고정 뱃지 */}
        <View style={styles.noticeTitleRow}>
          <Text style={styles.noticeTitle} numberOfLines={1}>
            {notice.title}
          </Text>
          {notice.isPinned && (
            <View style={styles.pinnedBadge}>
              <Bookmark
                size={12}
                color={colors.success}
                fill={colors.success}
              />
              <Text style={styles.pinnedText}>고정</Text>
            </View>
          )}
        </View>

        {/* 내용 미리보기 */}
        <Text style={styles.noticeContent} numberOfLines={1}>
          {notice.content}
        </Text>

        {/* 작성일 */}
        <Text style={styles.noticeDate}>{notice.createdAt}</Text>
      </View>

      {/* 관리 버튼 */}
      <View style={styles.noticeButtons}>
        {/* 고정/해제 버튼 */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            notice.isPinned ? styles.unpinButton : styles.pinButton,
          ]}
          onPress={() => handleTogglePin(notice.id)}
          activeOpacity={0.7}>
          <Bookmark
            size={16}
            color={notice.isPinned ? colors.success : colors.textDarkGray}
            fill={notice.isPinned ? colors.success : 'transparent'}
          />
          <Text
            style={
              notice.isPinned ? styles.unpinButtonText : styles.pinButtonText
            }>
            {notice.isPinned ? '고정 해제' : '고정'}
          </Text>
        </TouchableOpacity>

        {/* 수정 버튼 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() =>
            navigation.navigate('NoticeForm', {
              mode: 'edit',
              noticeId: notice.id,
              selectedImage: undefined,
              currentTitle: undefined,
              currentContent: undefined,
              currentImage: undefined,
              timestamp: Date.now(), // 강제 리렌더링용
            })
          }
          activeOpacity={0.7}>
          <Edit2 size={16} color={colors.white} />
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>

        {/* 삭제 버튼 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => confirmDelete(notice.id)}
          activeOpacity={0.7}>
          <Trash2 size={16} color={colors.white} />
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('AdminSettings')}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>공지사항 관리</Text>
        </View>

        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={colors.textLightGray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="공지사항 검색"
            placeholderTextColor="rgba(10, 10, 10, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 새 공지 작성 버튼 */}
        <LinearGradient
          colors={['#05DF72', '#00BC7D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          angle={172.5}
          style={styles.createButton}>
          <TouchableOpacity
            style={styles.createButtonInner}
            onPress={() =>
              navigation.navigate('NoticeForm', {
                mode: 'create',
                noticeId: undefined,
                selectedImage: undefined,
                currentTitle: undefined,
                currentContent: undefined,
                currentImage: undefined,
                timestamp: Date.now(), // 강제 리렌더링용
              })
            }
            activeOpacity={0.8}>
            <Plus size={20} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.createButtonText}>새 공지 작성</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* 공지사항 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredNotices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? '검색 결과가 없습니다.'
                : '등록된 공지사항이 없습니다.'}
            </Text>
          </View>
        ) : (
          filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))
        )}
      </ScrollView>

      {/* 삭제 확인 모달 */}
      <IngredientModal
        visible={deleteModalVisible}
        type="delete"
        title="공지사항 삭제"
        message="정말 이 공지사항을 삭제하시겠습니까?"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}
