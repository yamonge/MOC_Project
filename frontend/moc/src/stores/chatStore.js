import {create} from 'zustand';

/**
 * 채팅 전역 상태 관리 Store (Zustand)
 *
 * 사용법:
 * import useChatStore from '../stores/chatStore';
 *
 * const chatRooms = useChatStore(state => state.chatRooms);
 * const setChatRooms = useChatStore(state => state.setChatRooms);
 */
const useChatStore = create((set, get) => ({
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📦 State (상태 데이터)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * WebSocket 연결 상태
   */
  isConnected: false,

  /**
   * 현재 사용자 정보
   */
  currentUser: {
    userId: null,
    nickname: null,
  },

  /**
   * 채팅방 목록
   * @type {Array<{chatRoomId, placeName, lastMessage, statusCd, unreadCount, updatedAt}>}
   */
  chatRooms: [],

  /**
   * 채팅방별 메시지 목록
   * @type {Object<number, Array<Message>>}
   * @example { 1: [msg1, msg2], 2: [msg1, msg2] }
   */
  messages: {},

  /**
   * 현재 활성화된 채팅방 ID
   */
  activeRoomId: null,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔧 Actions (상태 변경 함수)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * WebSocket 연결 상태 변경
   * @param {boolean} status - 연결 상태
   */
  setConnected: status => {
    console.log('📡 [chatStore] 연결 상태 변경:', status);
    set({isConnected: status});
  },

  /**
   * 현재 사용자 정보 설정
   * @param {object} user - { userId, nickname }
   */
  setCurrentUser: user => {
    console.log('👤 [chatStore] 사용자 정보 설정:', user);
    set({currentUser: user});
  },

  /**
   * 채팅방 목록 설정 (전체 교체)
   * @param {Array} rooms - 채팅방 목록
   */
  setChatRooms: rooms => {
    // 배열 검증 (방어 코드)
    const validRooms = Array.isArray(rooms) ? rooms : [];
    console.log('📋 [chatStore] 채팅방 목록 설정:', validRooms.length, '개');
    set({chatRooms: validRooms});
  },

  /**
   * 채팅방 추가
   * @param {object} room - 채팅방 정보
   */
  addChatRoom: room => {
    console.log('➕ [chatStore] 채팅방 추가:', room.placeName);
    set(state => ({
      chatRooms: [room, ...state.chatRooms],
    }));
  },

  /**
   * 채팅방 업데이트 (일부 필드만 변경)
   * @param {number} roomId - 채팅방 ID
   * @param {object} updates - 업데이트할 필드 { lastMessage, unreadCount, ... }
   */
  updateChatRoom: (roomId, updates) => {
    console.log('🔄 [chatStore] 채팅방 업데이트:', roomId, updates);
    set(state => ({
      chatRooms: state.chatRooms.map(room =>
        room.chatRoomId === roomId ? {...room, ...updates} : room,
      ),
    }));
  },

  /**
   * 채팅방 삭제
   * @param {number} roomId - 채팅방 ID
   */
  removeChatRoom: roomId => {
    console.log('🗑️ [chatStore] 채팅방 삭제:', roomId);
    set(state => ({
      chatRooms: state.chatRooms.filter(room => room.chatRoomId !== roomId),
      messages: {
        ...state.messages,
        [roomId]: undefined, // 메시지도 삭제
      },
    }));
  },

  /**
   * 특정 채팅방의 메시지 목록 설정 (과거 메시지 로드)
   * @param {number} roomId - 채팅방 ID
   * @param {Array} messageList - 메시지 목록
   */
  setMessages: (roomId, messageList) => {
    console.log(
      '💬 [chatStore] 메시지 설정:',
      roomId,
      messageList.length,
      '개',
    );
    set(state => ({
      messages: {
        ...state.messages,
        [roomId]: messageList,
      },
    }));
  },

  /**
   * 메시지 추가 (실시간 새 메시지)
   * @param {number} roomId - 채팅방 ID
   * @param {object} message - 메시지 객체
   */
  addMessage: (roomId, message) => {
    console.log('📨 [chatStore] 메시지 추가:', roomId, message.messageText);

    set(state => {
      const currentMessages = state.messages[roomId] || [];

      // 중복 메시지 방지 (messageId 기준)
      const isDuplicate = currentMessages.some(
        msg => msg.messageId === message.messageId,
      );

      if (isDuplicate) {
        console.log('⚠️ [chatStore] 중복 메시지 무시:', message.messageId);
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [roomId]: [...currentMessages, message],
        },
      };
    });

    // 채팅방 목록의 마지막 메시지 업데이트
    get().updateChatRoom(roomId, {
      lastMessage: message.messageText,
      lastSenderNickname: message.senderNickname,
      updatedAt: message.createdAt || new Date().toISOString(),
    });
  },

  /**
   * 미읽은 메시지 카운트 증가
   * @param {number} roomId - 채팅방 ID
   * @param {number} count - 증가할 개수 (기본 1)
   */
  incrementUnreadCount: (roomId, count = 1) => {
    console.log('🔔 [chatStore] 미읽은 메시지 증가:', roomId, `+${count}`);
    set(state => ({
      chatRooms: state.chatRooms.map(room =>
        room.chatRoomId === roomId
          ? {...room, unreadCount: (room.unreadCount || 0) + count}
          : room,
      ),
    }));
  },

  /**
   * 미읽은 메시지 카운트 초기화
   * @param {number} roomId - 채팅방 ID
   */
  resetUnreadCount: roomId => {
    console.log('✅ [chatStore] 미읽은 메시지 초기화:', roomId);
    set(state => ({
      chatRooms: state.chatRooms.map(room =>
        room.chatRoomId === roomId ? {...room, unreadCount: 0} : room,
      ),
    }));
  },

  /**
   * 현재 활성화된 채팅방 설정 (채팅 화면 진입 시)
   * @param {number} roomId - 채팅방 ID
   */
  setActiveRoom: roomId => {
    console.log('🎯 [chatStore] 활성 채팅방 설정:', roomId);
    set({activeRoomId: roomId});

    // 활성화 시 미읽은 메시지 초기화
    if (roomId) {
      get().resetUnreadCount(roomId);
    }
  },

  /**
   * 전체 초기화 (로그아웃 시)
   */
  reset: () => {
    console.log('🔄 [chatStore] 전체 초기화');
    set({
      isConnected: false,
      currentUser: {userId: null, nickname: null},
      chatRooms: [],
      messages: {},
      activeRoomId: null,
    });
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 Computed (계산된 값 - 함수로 제공)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 전체 미읽은 메시지 개수 계산
   * @returns {number} 총 미읽은 메시지 수
   */
  getTotalUnreadCount: () => {
    const {chatRooms} = get();
    return chatRooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
  },

  /**
   * 특정 채팅방의 메시지 가져오기
   * @param {number} roomId - 채팅방 ID
   * @returns {Array} 메시지 목록
   */
  getMessages: roomId => {
    const {messages} = get();
    return messages[roomId] || [];
  },

  /**
   * 특정 채팅방 정보 가져오기
   * @param {number} roomId - 채팅방 ID
   * @returns {object|null} 채팅방 정보
   */
  getChatRoom: roomId => {
    const {chatRooms} = get();
    return chatRooms.find(room => room.chatRoomId === roomId) || null;
  },
}));

export default useChatStore;
