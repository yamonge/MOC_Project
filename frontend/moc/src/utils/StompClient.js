import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_BASE_URL} from '../api/axiosConfig';

/**
 * WebSocket STOMP 클라이언트 (싱글톤)
 *
 * 사용법:
 * 1. 연결: StompClient.connect(userId, onConnected, onError)
 * 2. 구독: StompClient.subscribe(chatRoomId, callback)
 * 3. 전송: StompClient.sendMessage(messageData)
 * 4. 종료: StompClient.disconnect()
 */
class StompClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map(); // 구독 관리 (roomId -> subscription)
    this.messageQueue = []; // 연결 전 메시지 큐
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3초
  }

  /**
   * WebSocket 서버 URL 가져오기
   */
  getWebSocketUrl() {
    return `${SERVER_BASE_URL}/ws-chat`;
  }

  /**
   * WebSocket 연결
   * @param {number} userId - 현재 사용자 ID
   * @param {function} onConnected - 연결 성공 콜백
   * @param {function} onError - 연결 실패 콜백
   */
  async connect(userId, onConnected, onError) {
    if (this.isConnected) {
      if (onConnected) onConnected();
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const socket = new SockJS(this.getWebSocketUrl());

      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: token ? {Authorization: `Bearer ${token}`} : {},
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: __DEV__ ? (str => console.log('STOMP:', str)) : () => {},

        onConnect: frame => {
          if (__DEV__) console.log('WebSocket 연결 성공', frame);
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // 큐에 쌓인 메시지 전송
          this.flushMessageQueue();

          if (onConnected) onConnected();
        },

        onDisconnect: () => {
          if (__DEV__) console.log('WebSocket 연결 해제');
          this.isConnected = false;
        },

        onWebSocketError: error => {
          if (__DEV__) console.error('WebSocket 에러:', error);
          if (onError) onError(error);
        },

        onStompError: frame => {
          if (__DEV__) console.error('STOMP 에러:', frame.headers['message'], frame.body);
          if (onError) onError(frame);
        },

        onWebSocketClose: event => {
          if (__DEV__) console.log('WebSocket 연결 종료:', event.reason);
          this.isConnected = false;

          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            if (__DEV__) console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          } else {
            if (__DEV__) console.error('최대 재연결 시도 횟수 초과');
          }
        },
      });

      this.client.activate();
    } catch (error) {
      if (__DEV__) console.error('WebSocket 연결 실패:', error);
      if (onError) onError(error);
    }
  }

  /**
   * 채팅방 구독 (실시간 메시지 수신)
   * @param {number} chatRoomId - 채팅방 ID
   * @param {function} callback - 메시지 수신 콜백
   * @returns {object} subscription 객체 (unsubscribe 가능)
   */
  subscribe(chatRoomId, callback) {
    if (!this.client || !this.isConnected) {
      if (__DEV__) console.error('WebSocket이 연결되지 않았습니다. 먼저 connect()를 호출하세요.');
      return null;
    }

    if (this.subscriptions.has(chatRoomId)) {
      if (__DEV__) console.log(`채팅방 ${chatRoomId}는 이미 구독 중입니다.`);
      return this.subscriptions.get(chatRoomId);
    }

    if (__DEV__) console.log(`채팅방 구독 시작: /topic/room/${chatRoomId}`);

    // 구독
    const subscription = this.client.subscribe(
      `/topic/room/${chatRoomId}`,
      message => {
        try {
          const data = JSON.parse(message.body);
          if (__DEV__) console.log('메시지 수신:', data);
          callback(data);
        } catch (error) {
          if (__DEV__) console.error('메시지 파싱 실패:', error);
        }
      },
    );

    // 구독 저장
    this.subscriptions.set(chatRoomId, subscription);

    return subscription;
  }

  /**
   * 채팅방 구독 해제
   * @param {number} chatRoomId - 채팅방 ID
   */
  unsubscribe(chatRoomId) {
    const subscription = this.subscriptions.get(chatRoomId);

    if (subscription) {
      if (__DEV__) console.log(`채팅방 구독 해제: /topic/room/${chatRoomId}`);
      subscription.unsubscribe();
      this.subscriptions.delete(chatRoomId);
    }
  }

  /**
   * 모든 구독 해제
   */
  unsubscribeAll() {
    if (__DEV__) console.log('모든 채팅방 구독 해제');
    this.subscriptions.forEach((subscription, chatRoomId) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  /**
   * 메시지 전송
   * @param {object} messageData - { chatRoomId, senderUserId, senderNickname, messageText }
   */
  sendMessage(messageData) {
    if (!this.client || !this.isConnected) {
      if (__DEV__) console.warn('WebSocket 연결 대기 중... 메시지를 큐에 추가합니다.');
      this.messageQueue.push(messageData);
      return;
    }

    if (__DEV__) console.log('메시지 전송:', messageData);

    try {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          chatRoomId: messageData.chatRoomId,
          senderUserId: messageData.senderUserId,
          senderNickname: messageData.senderNickname,
          messageTypeCd: messageData.messageTypeCd || 'TEXT',
          messageText: messageData.messageText,
        }),
      });
    } catch (error) {
      if (__DEV__) console.error('메시지 전송 실패:', error);
    }
  }

  /**
   * 사용자 입장 알림
   * @param {number} chatRoomId - 채팅방 ID
   * @param {number} senderUserId - 사용자 ID
   * @param {string} senderNickname - 사용자 닉네임
   */
  sendJoinMessage(chatRoomId, senderUserId, senderNickname) {
    if (!this.client || !this.isConnected) {
      if (__DEV__) console.error('WebSocket이 연결되지 않았습니다.');
      return;
    }

    if (__DEV__) console.log('입장 알림 전송:', {chatRoomId, senderNickname});

    try {
      this.client.publish({
        destination: '/app/chat.join',
        body: JSON.stringify({
          chatRoomId,
          senderUserId,
          senderNickname,
          messageTypeCd: 'SYSTEM',
        }),
      });
    } catch (error) {
      if (__DEV__) console.error('입장 알림 전송 실패:', error);
    }
  }

  /**
   * 사용자 퇴장 알림
   * @param {number} chatRoomId - 채팅방 ID
   * @param {number} senderUserId - 사용자 ID
   * @param {string} senderNickname - 사용자 닉네임
   */
  sendLeaveMessage(chatRoomId, senderUserId, senderNickname) {
    if (!this.client || !this.isConnected) {
      if (__DEV__) console.error('WebSocket이 연결되지 않았습니다.');
      return;
    }

    if (__DEV__) console.log('퇴장 알림 전송:', {chatRoomId, senderNickname});

    try {
      this.client.publish({
        destination: '/app/chat.leave',
        body: JSON.stringify({
          chatRoomId,
          senderUserId,
          senderNickname,
          messageTypeCd: 'SYSTEM',
        }),
      });
    } catch (error) {
      if (__DEV__) console.error('퇴장 알림 전송 실패:', error);
    }
  }

  /**
   * 큐에 쌓인 메시지 전송 (연결 후)
   */
  flushMessageQueue() {
    if (this.messageQueue.length === 0) return;

    if (__DEV__) console.log(`큐에 쌓인 메시지 ${this.messageQueue.length}개 전송`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect() {
    if (!this.client) {
      if (__DEV__) console.log('WebSocket이 이미 종료되었습니다.');
      return;
    }

    if (__DEV__) console.log('WebSocket 연결 종료...');

    this.unsubscribeAll();

    this.client.deactivate();
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;

    if (__DEV__) console.log('WebSocket 연결 종료 완료');
  }

  /**
   * 연결 상태 확인
   * @returns {boolean} 연결 여부
   */
  isActive() {
    return this.isConnected && this.client?.connected;
  }

  /**
   * 현재 구독 중인 채팅방 목록
   * @returns {Array<number>} 채팅방 ID 배열
   */
  getSubscribedRooms() {
    return Array.from(this.subscriptions.keys());
  }
}

// 싱글톤 인스턴스 생성 및 export
export default new StompClient();
