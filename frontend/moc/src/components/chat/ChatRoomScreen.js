import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {Portal} from '@gorhom/portal';
import {
  ChevronLeft,
  Users,
  Trash2,
  AlertTriangle,
  UserX,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useKeyboard} from '../../utils/useKeyboard';
import styles from '../../styles/components/chat/ChatRoomScreenStyles';
import ParticipantProfileBottomSheet from './ParticipantProfileBottomSheet';
import ReportModal from '../common/ReportModal';
import {reportUser} from '../../api/report';
import {
  getChatMessages,
  getChatRoomParticipants,
  leaveChatRoom,
  deleteChatRoom,
  kickParticipant,
} from '../../api/chat';
import StompClient from '../../utils/StompClient';
import useChatStore from '../../stores/chatStore';

const ChatRoomScreen = ({
  visible,
  onClose,
  placeName,
  statusCd,
  chatRoomId,
}) => {
  const {keyboardHeight} = useKeyboard();
  const roomName = placeName || '이마트 쌍용점';
  const status =
    statusCd === 'OPEN' ? '진행중' : statusCd === 'DONE' ? '완료' : '취소됨';

  // 🔥 Zustand Store 연동 - useMemo로 안정적인 selector 제공
  const allMessages = useChatStore(state => state.messages);
  const updateChatRoom = useChatStore(state => state.updateChatRoom);
  const removeChatRoom = useChatStore(state => state.removeChatRoom);
  const messages = useMemo(() => {
    if (!chatRoomId) return [];
    return allMessages[chatRoomId] || [];
  }, [allMessages, chatRoomId]);

  const [message, setMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showProfileBottomSheet, setShowProfileBottomSheet] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [isRoomOwner, setIsRoomOwner] = useState(false); // 방장 여부 (API 응답에서 설정)
  const [participants, setParticipants] = useState([]);
  const messageInputRef = useRef(null); // 한글 입력 문제 해결을 위한 ref
  const scrollViewRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserNickname, setCurrentUserNickname] = useState(null);

  const handleSend = text => {
    // ✅ 타입 안전성 보장 (한글 분해 문제 해결 + 에러 방지)
    let messageText = '';

    if (typeof text === 'string') {
      messageText = text.trim();
    } else if (typeof message === 'string') {
      messageText = message.trim();
    }

    if (messageText && chatRoomId && currentUserId) {
      // 🔥 WebSocket으로 메시지 전송
      StompClient.sendMessage({
        chatRoomId,
        senderUserId: currentUserId,
        senderNickname: currentUserNickname,
        messageText: messageText,
      });

      // 입력창 초기화
      setMessage('');
      if (messageInputRef.current) {
        messageInputRef.current.clear();
      }

      // 메시지 전송 후 스크롤을 맨 아래로
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  const handleLeaveChatRoom = async () => {
    if (isRoomOwner) {
      // 방장인 경우 - 채팅방 폐기
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(
          '채팅방을 폐기하시겠습니까?\n모든 참여자가 나가게 됩니다.',
        );
        if (confirmed) {
          try {
            await deleteChatRoom(chatRoomId, currentUserId);
            console.log('✅ 채팅방 폐기 완료');
            // 🔥 Zustand store 상태 업데이트
            updateChatRoom(chatRoomId, {statusCd: 'DELETED'});
            onClose();
          } catch (error) {
            console.error('❌ 채팅방 폐기 실패:', error);
            window.alert('채팅방 폐기에 실패했습니다.');
          }
        }
      } else {
        const {Alert} = require('react-native');
        Alert.alert(
          '채팅방 폐기',
          '채팅방을 폐기하시겠습니까?\n모든 참여자가 나가게 됩니다.',
          [
            {text: '취소', style: 'cancel'},
            {
              text: '폐기',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteChatRoom(chatRoomId, currentUserId);
                  console.log('✅ 채팅방 폐기 완료');
                  // 🔥 Zustand store 상태 업데이트
                  updateChatRoom(chatRoomId, {statusCd: 'DELETED'});
                  onClose();
                } catch (error) {
                  console.error('❌ 채팅방 폐기 실패:', error);
                  Alert.alert('오류', '채팅방 폐기에 실패했습니다.');
                }
              },
            },
          ],
        );
      }
    } else {
      // 일반 참여자인 경우 - 채팅방 나가기
      if (Platform.OS === 'web') {
        const confirmed = window.confirm('채팅방을 나가시겠습니까?');
        if (confirmed) {
          try {
            await leaveChatRoom(chatRoomId, currentUserId);
            console.log('✅ 채팅방 나가기 완료');
            // 🔥 Zustand store에서 제거
            removeChatRoom(chatRoomId);
            onClose();
          } catch (error) {
            console.error('❌ 채팅방 나가기 실패:', error);
            window.alert('채팅방 나가기에 실패했습니다.');
          }
        }
      } else {
        const {Alert} = require('react-native');
        Alert.alert('채팅방 나가기', '채팅방을 나가시겠습니까?', [
          {text: '취소', style: 'cancel'},
          {
            text: '나가기',
            style: 'destructive',
            onPress: async () => {
              try {
                await leaveChatRoom(chatRoomId, currentUserId);
                console.log('✅ 채팅방 나가기 완료');
                // 🔥 Zustand store에서 제거
                removeChatRoom(chatRoomId);
                onClose();
              } catch (error) {
                console.error('❌ 채팅방 나가기 실패:', error);
                Alert.alert('오류', '채팅방 나가기에 실패했습니다.');
              }
            },
          },
        ]);
      }
    }
  };

  const handleKickParticipant = async participantId => {
    // 강퇴 기능 (방장만)
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('이 참여자를 강퇴하시겠습니까?');
      if (confirmed) {
        try {
          await kickParticipant(chatRoomId, participantId, currentUserId);
          console.log('✅ 참여자 강퇴 완료:', participantId);
          // 참여자 목록 새로고침
          const data = await getChatRoomParticipants(chatRoomId);
          const userId = await AsyncStorage.getItem('userId');
          const currentUserIdNum = Number(userId);
          const formattedParticipants = data.map(p => ({
            userId: p.userId,
            nickname: p.nickname,
            ratingScore: p.ratingScore,
            profileImageUrl: p.profileImageUrl || null,
            isMe: p.userId === currentUserIdNum,
          }));
          setParticipants(formattedParticipants);
          window.alert('참여자가 강퇴되었습니다.');
        } catch (error) {
          console.error('❌ 참여자 강퇴 실패:', error);
          window.alert('참여자 강퇴에 실패했습니다.');
        }
      }
    } else {
      const {Alert} = require('react-native');
      Alert.alert('참여자 강퇴', '이 참여자를 강퇴하시겠습니까?', [
        {text: '취소', style: 'cancel'},
        {
          text: '강퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              await kickParticipant(chatRoomId, participantId, currentUserId);
              console.log('✅ 참여자 강퇴 완료:', participantId);
              // 참여자 목록 새로고침
              const data = await getChatRoomParticipants(chatRoomId);
              const userId = await AsyncStorage.getItem('userId');
              const currentUserIdNum = Number(userId);
              const formattedParticipants = data.map(p => ({
                userId: p.userId,
                nickname: p.nickname,
                ratingScore: p.ratingScore,
                profileImageUrl: p.profileImageUrl || null,
                isMe: p.userId === currentUserIdNum,
              }));
              setParticipants(formattedParticipants);
              Alert.alert('완료', '참여자가 강퇴되었습니다.');
            } catch (error) {
              console.error('❌ 참여자 강퇴 실패:', error);
              Alert.alert('오류', '참여자 강퇴에 실패했습니다.');
            }
          },
        },
      ]);
    }
  };

  const handleShowProfile = participant => {
    // 프로필 바텀시트 열기
    setSelectedParticipant(participant);
    setShowProfileBottomSheet(true);
    setShowParticipants(false); // 참여자 목록 닫기
  };

  const handleReportUser = participant => {
    // 신고 모달 열기
    setReportTarget({
      ...participant,
      type: 'user', // 🔥 신고 타입 추가
      id: participant.userId, // 🔥 신고 대상 ID
    });
    setShowReportModal(true);
    setShowParticipants(false); // 참여자 목록 닫기
  };

  const handleSubmitReport = async reportData => {
    // ✅ ReportModal에서 이미 API 호출을 처리하므로 여기서는 삭제
    // ReportModal의 onSubmit은 추가 작업이 필요한 경우에만 사용
    console.log('✅ [ChatRoomScreen] 신고 완료 콜백');
  };

  // 🔥 채팅방 초기화 및 WebSocket 구독
  useEffect(() => {
    if (!visible || !chatRoomId) return;

    console.log('💬 [ChatRoomScreen] 채팅방 진입:', chatRoomId);

    // Zustand actions를 한 번만 가져오기
    const store = useChatStore.getState();

    // 1. 활성 채팅방 설정 (미읽은 메시지 초기화)
    store.setActiveRoom(chatRoomId);

    // 2. 현재 사용자 정보 로드
    const loadUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const nickname = await AsyncStorage.getItem('userNickname');
        setCurrentUserId(Number(userId));
        setCurrentUserNickname(nickname || '사용자');
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    // ✅ WebSocket 연결 확인 및 자동 재연결
    const ensureWebSocketConnection = async () => {
      if (!StompClient.isConnected) {
        console.log('⚠️ [ChatRoomScreen] WebSocket 연결 안 됨. 재연결 시도...');
        try {
          const userId = await AsyncStorage.getItem('userId');
          const nickname = await AsyncStorage.getItem('userNickname');

          if (userId) {
            await new Promise((resolve, reject) => {
              StompClient.connect(
                Number(userId),
                () => {
                  console.log('✅ [ChatRoomScreen] WebSocket 재연결 성공!');
                  store.setConnected(true);
                  resolve();
                },
                error => {
                  console.error(
                    '❌ [ChatRoomScreen] WebSocket 재연결 실패:',
                    error,
                  );
                  store.setConnected(false);
                  reject(error);
                },
              );
            });
          }
        } catch (error) {
          console.error('💥 [ChatRoomScreen] WebSocket 재연결 에러:', error);
        }
      } else {
        console.log('✅ [ChatRoomScreen] WebSocket 이미 연결됨');
      }
    };

    // 3. 과거 메시지 로드 (REST API)
    const loadPastMessages = async () => {
      try {
        console.log('📥 [ChatRoomScreen] 과거 메시지 로드 시작...');
        const data = await getChatMessages(chatRoomId, 50);

        // 현재 사용자 ID 가져오기
        const userId = await AsyncStorage.getItem('userId');
        const currentUserIdNum = Number(userId);

        // 메시지 변환 (API 형식 → 화면 표시 형식)
        const formattedMessages = data
          .map(msg => ({
            messageId: msg.messageId,
            sender: msg.senderNickname,
            text: msg.messageText,
            time: new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            isMe: msg.senderUserId === currentUserIdNum,
            messageTypeCd: msg.messageTypeCd,
            isSystem: msg.messageTypeCd === 'SYSTEM',
            createdAt: msg.createdAt,
          }))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // 🔥 시간순 정렬 (오래된 것부터)

        store.setMessages(chatRoomId, formattedMessages);
        console.log(
          '✅ [ChatRoomScreen] 과거 메시지 로드 완료:',
          formattedMessages.length,
          '개',
        );
      } catch (error) {
        console.error('❌ [ChatRoomScreen] 과거 메시지 로드 실패:', error);
        // 에러 시 빈 배열로 초기화
        store.setMessages(chatRoomId, []);
      }
    };

    // 4. 초기화 함수 실행
    const initialize = async () => {
      await ensureWebSocketConnection(); // WebSocket 재연결 확인
      await loadUserInfo(); // 사용자 정보 로드
      await loadPastMessages(); // 과거 메시지 로드
      await sendJoinNotification(); // 입장 알림
    };

    // 5. WebSocket 구독 (실시간 메시지 수신)
    const subscription = StompClient.subscribe(chatRoomId, newMessage => {
      console.log('📨 [ChatRoomScreen] 실시간 메시지 수신:', newMessage);

      // 🔥 강퇴 메시지 처리 (화면 강제 종료)
      if (newMessage.action === 'ROOM_KICKED') {
        // 방 전체 폐기
        Alert.alert('알림', '방장이 채팅방을 폐기했습니다.', [
          {text: '확인', onPress: () => onClose()},
        ]);
        return;
      }

      if (
        newMessage.action === 'USER_KICKED' &&
        newMessage.targetUserId === currentUserId
      ) {
        // 개인 강퇴
        Alert.alert('알림', '방장에 의해 강퇴되었습니다.', [
          {text: '확인', onPress: () => onClose()},
        ]);
        return;
      }

      // ✅ Zustand store에서 currentUser 가져오기 (최신 값 보장)
      const currentUser = useChatStore.getState().currentUser;
      const currentUserIdNum = currentUser?.userId || 0;

      // 메시지 변환
      const formattedMessage = {
        messageId: newMessage.messageId,
        sender: newMessage.senderNickname,
        text: newMessage.messageText,
        time: new Date(newMessage.createdAt || Date.now()).toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          },
        ),
        isMe: newMessage.senderUserId === currentUserIdNum,
        messageTypeCd: newMessage.messageTypeCd, // 🔥 시스템 메시지 타입 포함
        isSystem: newMessage.messageTypeCd === 'SYSTEM', // 🔥 시스템 메시지 여부
        createdAt: newMessage.createdAt || new Date().toISOString(),
      };

      // Zustand store에 추가 (자동으로 화면 업데이트)
      useChatStore.getState().addMessage(chatRoomId, formattedMessage);

      // 스크롤 맨 아래로
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    });

    // 5. 입장 알림 전송 (사용자 정보 로드 후)
    const sendJoinNotification = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const nickname = await AsyncStorage.getItem('userNickname');

        if (userId && nickname) {
          console.log('🚪 [ChatRoomScreen] 입장 알림 전송');
          StompClient.sendJoinMessage(chatRoomId, Number(userId), nickname);
        }
      } catch (error) {
        console.error('입장 알림 전송 실패:', error);
      }
    };

    // ✅ 초기화 실행 (위에서 정의한 initialize 함수 호출)
    initialize();

    // 클린업 (화면 나갈 때)
    return () => {
      console.log('👋 [ChatRoomScreen] 채팅방 나가기:', chatRoomId);

      // 🚪 퇴장 알림 전송
      const sendLeaveNotification = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          const nickname = await AsyncStorage.getItem('userNickname');

          if (userId && nickname) {
            console.log('🚪 [ChatRoomScreen] 퇴장 알림 전송');
            StompClient.sendLeaveMessage(chatRoomId, Number(userId), nickname);
          }
        } catch (error) {
          console.error('퇴장 알림 전송 실패:', error);
        }
      };

      sendLeaveNotification();

      // WebSocket 구독 해제
      if (subscription) {
        StompClient.unsubscribe(chatRoomId);
      }

      // 활성 채팅방 해제
      useChatStore.getState().setActiveRoom(null);
    };
  }, [visible, chatRoomId]);

  // 참여자 목록 조회
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        console.log('👥 [ChatRoomScreen] 참여자 목록 조회 시작...');
        const data = await getChatRoomParticipants(chatRoomId);

        // 현재 사용자 표시
        const userId = await AsyncStorage.getItem('userId');
        const currentUserIdNum = Number(userId);

        const formattedParticipants = data.map(p => ({
          userId: p.userId,
          nickname: p.nickname,
          ratingScore: p.ratingScore,
          profileImageUrl: p.profileImageUrl || null,
          isMe: p.userId === currentUserIdNum,
          isOwner: p.isOwner, // 방장 여부 (API 응답)
        }));

        setParticipants(formattedParticipants);

        // 현재 사용자가 방장인지 확인
        const currentUser = formattedParticipants.find(p => p.isMe);
        if (currentUser) {
          setIsRoomOwner(currentUser.isOwner || false);
        }

        console.log(
          '✅ [ChatRoomScreen] 참여자 목록 로드 완료:',
          formattedParticipants.length,
          '명 (방장:',
          currentUser?.isOwner ? 'O' : 'X',
          ')',
        );
      } catch (error) {
        console.error('❌ [ChatRoomScreen] 참여자 목록 조회 실패:', error);
      }
    };

    if (visible && chatRoomId) {
      fetchParticipants();
    }
  }, [visible, chatRoomId]);

  const renderMessage = (msg, index) => {
    const key = msg.messageId || `msg-${index}`;

    // 🔥 시스템 메시지 (입장/퇴장 알림)
    if (msg.messageTypeCd === 'SYSTEM' || msg.isSystem) {
      return (
        <View key={key} style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{msg.text}</Text>
        </View>
      );
    }

    if (msg.isMe) {
      return (
        <View key={key} style={styles.myMessageContainer}>
          <View style={styles.myMessageBubble}>
            <Text style={styles.myMessageText}>{msg.text}</Text>
          </View>
          <Text style={styles.messageTime}>{msg.time}</Text>
        </View>
      );
    } else {
      return (
        <View key={key} style={styles.otherMessageContainer}>
          <Text style={styles.senderName}>{msg.sender}</Text>
          <View style={styles.otherMessageBubble}>
            <Text style={styles.otherMessageText}>{msg.text}</Text>
          </View>
          <Text style={styles.messageTime}>{msg.time}</Text>
        </View>
      );
    }
  };

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.roomName}>{roomName}</Text>
              <Text style={styles.roomStatus}>🟢 {status}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={toggleParticipants}>
              <Users size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={handleLeaveChatRoom}>
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        {/* 채팅 메시지 영역 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageArea}
          contentContainerStyle={[
            styles.messageContent,
            {paddingBottom: Math.max(keyboardHeight, 80) + 100}, // 🔥 충분한 여백 확보
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            // 새 메시지가 추가되면 자동으로 맨 아래로 스크롤
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
          }}>
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>

        {/* 참여자 목록 뷰 */}
        {showParticipants && (
          <TouchableOpacity
            style={styles.participantsOverlay}
            activeOpacity={1}
            onPress={toggleParticipants}>
            <TouchableOpacity
              style={styles.participantsContainer}
              activeOpacity={1}
              onPress={e => e.stopPropagation()}>
              <View style={styles.participantsHeader}>
                <Text style={styles.participantsTitle}>
                  참여자 ({participants.length}명)
                </Text>
              </View>
              <ScrollView
                style={styles.participantsList}
                showsVerticalScrollIndicator={false}>
                {participants.map(participant => (
                  <TouchableOpacity
                    key={participant.userId}
                    style={styles.participantCard}
                    activeOpacity={0.7}
                    onPress={() => handleShowProfile(participant)}>
                    <View style={styles.participantInfo}>
                      <View style={styles.participantAvatar}>
                        {participant.profileImageUrl ? (
                          <Image
                            source={{uri: participant.profileImageUrl}}
                            style={styles.participantAvatarImage}
                          />
                        ) : (
                          <Text style={styles.participantAvatarText}>
                            {participant.nickname.charAt(0)}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.participantNickname}>
                        {participant.nickname}
                      </Text>
                    </View>
                    {!participant.isMe && (
                      <View style={styles.participantActions}>
                        <TouchableOpacity
                          style={styles.participantActionButton}
                          activeOpacity={0.7}
                          onPress={e => {
                            e.stopPropagation();
                            handleReportUser(participant);
                          }}>
                          <AlertTriangle size={16} color="#FFA500" />
                        </TouchableOpacity>
                        {isRoomOwner && (
                          <TouchableOpacity
                            style={styles.participantActionButton}
                            activeOpacity={0.7}
                            onPress={e => {
                              e.stopPropagation();
                              handleKickParticipant(participant.userId);
                            }}>
                            <UserX size={16} color="#EF4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* 하단 입력창 */}
        <View style={[styles.inputContainer, {bottom: keyboardHeight}]}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={messageInputRef}
              style={styles.input}
              placeholder="메시지를 입력하세요"
              placeholderTextColor="rgba(23, 23, 23, 0.5)"
              defaultValue=""
              onChangeText={setMessage}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={e => {
                const text = e?.nativeEvent?.text || '';
                handleSend(text);
              }}
              blurOnSubmit={false}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSend(message)}
            activeOpacity={0.8}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>

        {/* 참여자 프로필 바텀시트 */}
        <ParticipantProfileBottomSheet
          visible={showProfileBottomSheet}
          onClose={() => setShowProfileBottomSheet(false)}
          participant={selectedParticipant}
        />

        {/* 신고 모달 */}
        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportTarget={reportTarget}
          onSubmit={handleSubmitReport}
        />
      </View>
    </Portal>
  );
};

export default ChatRoomScreen;
