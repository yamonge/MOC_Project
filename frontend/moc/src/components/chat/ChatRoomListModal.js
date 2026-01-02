import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  MessageCircle,
  X,
  Check,
  XCircle,
  Star,
  Trash2,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMyChatRooms, deleteChatRoom, leaveChatRoom} from '../../api/chat';
import {colors} from '../../styles/common';
import styles from '../../styles/components/chat/ChatRoomListModalStyles';
import ChatRoomScreen from './ChatRoomScreen';
import ReviewWriteModal from './ReviewWriteModal';
import useChatStore from '../../stores/chatStore';

/**
 * 채팅방 목록 모달
 */
export default function ChatRoomListModal({
  visible,
  onClose,
  navigation,
  route,
}) {
  // 🔥 Zustand Store 연동
  const chatRooms = useChatStore(state => state.chatRooms);
  const setChatRooms = useChatStore(state => state.setChatRooms);
  const removeChatRoom = useChatStore(state => state.removeChatRoom);

  const [loading, setLoading] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔥 후기 작성 모달 상태
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewRoom, setSelectedReviewRoom] = useState(null);

  // ✅ 외부에서 특정 채팅방 ID를 받아 자동으로 열기
  const openChatRoomId = route?.params?.openChatRoomId;

  // 🔥 사용자 ID 로드
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(Number(id));
      } catch (error) {
        console.error('userId 로드 실패:', error);
      }
    };
    loadUserId();
  }, []);

  // 🔥 채팅방 목록 로드 (무한 루프 방지)
  const fetchChatRooms = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log('📋 [ChatRoomListModal] 채팅방 목록 로드 시작...');
      const data = await getMyChatRooms(userId);
      setChatRooms(data);
      console.log(
        '✅ [ChatRoomListModal] 채팅방 목록 로드 완료:',
        data.length,
        '개',
      );
    } catch (error) {
      console.error('❌ [ChatRoomListModal] 채팅방 목록 로드 실패:', error);
      // 에러 시 더미 데이터 사용 (개발 중)
      setChatRooms(DUMMY_CHAT_ROOMS);
      Alert.alert(
        '알림',
        '채팅방 목록을 불러오는데 실패했습니다.\n더미 데이터를 사용합니다.',
      );
    } finally {
      setLoading(false);
    }
  }, [userId, setChatRooms]);

  // 채팅방 목록 로드 트리거
  useEffect(() => {
    if (visible && userId) {
      fetchChatRooms();
    }
  }, [visible, userId, fetchChatRooms]);

  // ✅ 외부에서 특정 채팅방 ID를 받으면 자동으로 열기
  useEffect(() => {
    if (openChatRoomId && chatRooms.length > 0) {
      const room = chatRooms.find(r => r.chatRoomId === openChatRoomId);
      if (room) {
        console.log('🚪 [자동 입장] 채팅방 열기:', openChatRoomId);
        setSelectedChatRoom(room);
        setShowChatRoom(true);

        // route params 초기화 (중복 실행 방지)
        if (navigation.setParams) {
          navigation.setParams({openChatRoomId: null});
        }
      }
    }
  }, [openChatRoomId, chatRooms, navigation]);

  const handleDelete = chatRoomId => {
    Alert.alert('확인', '목록에서 채팅방을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log(
              '🗑️ [ChatRoomListModal] 목록에서 채팅방 제거:',
              chatRoomId,
            );
            // 🔥 DB에 leave_date 업데이트 (목록에서 영구 숨김)
            await leaveChatRoom(chatRoomId, userId);
            // 🔥 Zustand store에서도 제거
            removeChatRoom(chatRoomId);
            Alert.alert('완료', '목록에서 삭제되었습니다.');
          } catch (error) {
            console.error('❌ [ChatRoomListModal] 목록 삭제 실패:', error);
            Alert.alert('오류', '삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleReviewPress = chatRoomId => {
    console.log('🌟 [후기 작성 버튼 클릭] chatRoomId:', chatRoomId);
    const chatRoom = chatRooms.find(room => room.chatRoomId === chatRoomId);

    if (!chatRoom) {
      Alert.alert('오류', '채팅방 정보를 찾을 수 없습니다.');
      return;
    }

    // 후기 작성 모달 열기
    setSelectedReviewRoom(chatRoom);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReviewRoom(null);
  };

  const handleReviewSuccess = async () => {
    console.log('✅ [후기 작성 완료]');

    // 🔥 후기 작성 후 자동으로 채팅방 목록에서 제거
    if (selectedReviewRoom) {
      try {
        console.log(
          '🗑️ [자동 삭제] 후기 작성 완료 후 채팅방 제거:',
          selectedReviewRoom.chatRoomId,
        );
        await leaveChatRoom(selectedReviewRoom.chatRoomId, userId);
        removeChatRoom(selectedReviewRoom.chatRoomId);
      } catch (error) {
        console.error('❌ [자동 삭제] 채팅방 제거 실패:', error);
      }
    }
  };

  const handleReviewSkip = async () => {
    console.log('⏭️ [후기 작성 안 함]');

    // 🔥 후기 작성 안 함 선택 시에도 자동으로 채팅방 목록에서 제거
    if (selectedReviewRoom) {
      try {
        console.log(
          '🗑️ [자동 삭제] 후기 작성 안 함 후 채팅방 제거:',
          selectedReviewRoom.chatRoomId,
        );
        await leaveChatRoom(selectedReviewRoom.chatRoomId, userId);
        removeChatRoom(selectedReviewRoom.chatRoomId);
      } catch (error) {
        console.error('❌ [자동 삭제] 채팅방 제거 실패:', error);
      }
    }
  };

  const handleChatRoomPress = chatRoomId => {
    const chatRoom = chatRooms.find(room => room.chatRoomId === chatRoomId);

    // 취소된/삭제된/완료된 채팅방은 입장 불가
    if (
      chatRoom.statusCd === 'CANCELED' ||
      chatRoom.statusCd === 'DELETED' ||
      chatRoom.statusCd === 'DONE'
    ) {
      const message =
        chatRoom.statusCd === 'DONE'
          ? '완료된 채팅방은 입장할 수 없습니다.'
          : '취소된 채팅방은 입장할 수 없습니다.';
      Alert.alert('알림', message);
      return;
    }

    setSelectedChatRoom(chatRoom);
    setShowChatRoom(true);
  };

  const handleCloseChatRoom = () => {
    setShowChatRoom(false);
    setSelectedChatRoom(null);
  };

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays === 1) return '어제';
    return `${diffDays}일 전`;
  };

  const renderChatRoomCard = ({item}) => {
    const {
      chatRoomId,
      placeName,
      lastMessage,
      unreadCount,
      statusCd,
      updatedAt,
    } = item;
    const isActive = statusCd === 'OPEN';
    const isDone = statusCd === 'DONE';
    const isCanceled = statusCd === 'CANCELED' || statusCd === 'DELETED';

    return (
      <TouchableOpacity
        style={styles.chatRoomCard}
        onPress={() => handleChatRoomPress(chatRoomId)}
        activeOpacity={0.8}>
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View style={styles.leftInfo}>
              {isActive && (
                <View style={[styles.statusDot, styles.statusDotActive]} />
              )}
              {isDone && (
                <View style={styles.iconContainer}>
                  <Check
                    size={18}
                    color={colors.primaryBlue}
                    strokeWidth={2.5}
                  />
                </View>
              )}
              {isCanceled && (
                <View style={styles.iconContainer}>
                  <XCircle size={18} color="#E7000B" strokeWidth={2.5} />
                </View>
              )}
              <Text style={styles.storeName}>{placeName}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text style={styles.timeText}>{formatTime(updatedAt)}</Text>
              {isActive && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.statusText,
                isActive && styles.statusActive,
                isDone && styles.statusDone,
                isCanceled && styles.statusCanceled,
              ]}>
              {isActive && '진행중'}
              {isDone && '완료'}
              {isCanceled && '취소됨'}
            </Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({item}) => {
    const isDone = item.statusCd === 'DONE';
    const isHost = item.hostUserId === userId; // 🔥 방장인지 확인

    return (
      <View style={styles.hiddenContainer}>
        {/* 🔥 완료된 채팅방이면서 자기가 방장이 아닐 때만 후기 작성 버튼 표시 */}
        {isDone && !isHost && (
          <TouchableOpacity
            style={[styles.hiddenButton, styles.reviewHiddenButton]}
            onPress={() => handleReviewPress(item.chatRoomId)}>
            <Star size={20} color="#BB4D00" strokeWidth={2} />
            <Text
              style={[styles.hiddenButtonText, styles.reviewHiddenButtonText]}>
              후기 작성
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.hiddenButton, styles.deleteHiddenButton]}
          onPress={() => handleDelete(item.chatRoomId)}>
          <Trash2 size={20} color={colors.textWhite} strokeWidth={2} />
          <Text style={styles.hiddenButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay2}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MessageCircle
              size={24}
              color={colors.primaryBlue}
              strokeWidth={2}
            />
            <Text style={styles.headerTitle}>채팅방 목록</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <X size={20} color={colors.textBlack} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
          </View>
        ) : chatRooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>참여한 채팅방이 없습니다</Text>
          </View>
        ) : (
          <>
            <SwipeListView
              data={chatRooms}
              keyExtractor={item => item.chatRoomId.toString()}
              renderItem={renderChatRoomCard}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-160}
              disableRightSwipe
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              style={styles.listContainer}
            />
            {/* 하단 힌트 */}
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                💡 카드를 왼쪽으로 밀면 삭제/후기 메뉴가 나타납니다
              </Text>
            </View>
          </>
        )}
      </View>
      <ChatRoomScreen
        visible={showChatRoom}
        onClose={handleCloseChatRoom}
        chatRoomId={selectedChatRoom?.chatRoomId}
        placeName={selectedChatRoom?.placeName}
        statusCd={selectedChatRoom?.statusCd}
      />

      {/* 후기 작성 모달 */}
      <ReviewWriteModal
        visible={showReviewModal}
        onClose={handleCloseReviewModal}
        chatRoomId={selectedReviewRoom?.chatRoomId}
        shoppingPostId={selectedReviewRoom?.shoppingPostId}
        placeName={selectedReviewRoom?.placeName}
        onSuccess={handleReviewSuccess}
        onSkip={handleReviewSkip}
      />
    </View>
  );
}
