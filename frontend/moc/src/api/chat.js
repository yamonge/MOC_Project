import axiosInstance from './axiosConfig';
import {normalizeImageUrl} from '../utils/imageUrlHelper';

/**
 * 채팅 관련 API
 */

/**
 * 내 채팅방 목록 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 채팅방 목록
 */
export const getMyChatRooms = async userId => {
  try {
    const response = await axiosInstance.get('/chat/rooms/me', {
      params: {userId},
    });
    return response;
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 채팅방 과거 메시지 조회
 * @param {number} chatRoomId - 채팅방 ID
 * @param {number} limit - 조회할 메시지 수 (기본 50)
 * @returns {Promise<Array>} 메시지 목록
 */
export const getChatMessages = async (chatRoomId, limit = 50) => {
  try {
    const response = await axiosInstance.get(`/chat/messages/${chatRoomId}`, {
      params: {limit},
    });
    return response;
  } catch (error) {
    console.error('메시지 조회 실패:', error);
    throw error;
  }
};

/**
 * 채팅 메시지 전송 (REST - 테스트용)
 * @param {object} messageData - { chatRoomId, senderUserId, messageTypeCd, messageText }
 * @returns {Promise<void>}
 */
export const sendChatMessage = async messageData => {
  try {
    await axiosInstance.post('/chat/messages/send', messageData);
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};

/**
 * 채팅방 참여자 목록 조회
 * @param {number} chatRoomId - 채팅방 ID
 * @returns {Promise<Array>} 참여자 목록
 */
export const getChatRoomParticipants = async chatRoomId => {
  try {
    const response = await axiosInstance.get(
      `/chat/rooms/${chatRoomId}/participants`,
    );
    
    // 참여자 목록의 프로필 이미지 URL 변환 (Android localhost 보정)
    if (Array.isArray(response)) {
      return response.map(participant => ({
        ...participant,
        profileImageUrl: participant.profileImageUrl
          ? normalizeImageUrl(participant.profileImageUrl)
          : null,
      }));
    }
    
    return response;
  } catch (error) {
    console.error('참여자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 채팅방 나가기 (참여자 제거)
 * @param {number} chatRoomId - 채팅방 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<void>}
 */
export const leaveChatRoom = async (chatRoomId, userId) => {
  try {
    await axiosInstance.post(`/chat/rooms/${chatRoomId}/leave`, null, {
      params: {userId},
    });
  } catch (error) {
    console.error('채팅방 나가기 실패:', error);
    throw error;
  }
};

/**
 * 채팅방 삭제 (방장만 가능)
 * @param {number} chatRoomId - 채팅방 ID
 * @param {number} userId - 사용자 ID (방장 확인용)
 * @returns {Promise<void>}
 */
export const deleteChatRoom = async (chatRoomId, userId) => {
  try {
    await axiosInstance.delete(`/chat/rooms/${chatRoomId}`, {
      params: {userId},
    });
  } catch (error) {
    console.error('채팅방 삭제 실패:', error);
    throw error;
  }
};

/**
 * 참여자 강퇴 (방장만 가능)
 * @param {number} chatRoomId - 채팅방 ID
 * @param {number} kickUserId - 강퇴할 사용자 ID
 * @param {number} requestUserId - 요청자 ID (방장 확인용)
 * @returns {Promise<void>}
 */
export const kickParticipant = async (
  chatRoomId,
  kickUserId,
  requestUserId,
) => {
  try {
    await axiosInstance.post(`/chat/rooms/${chatRoomId}/kick`, null, {
      params: {kickUserId, requestUserId},
    });
  } catch (error) {
    console.error('참여자 강퇴 실패:', error);
    throw error;
  }
};

/**
 * 사용자 후기 목록 조회
 * @param {number} userId - 사용자 ID
 * @param {number} limit - 조회할 후기 수 (기본 전체)
 * @returns {Promise<Object>} 후기 데이터 { rating, reviewCount, reviews: [] }
 */
export const getUserReviews = async (userId, limit = null) => {
  try {
    const params = limit ? {limit} : {};
    const response = await axiosInstance.get(`/auth/${userId}/reviews`, {
      params,
    });
    return response;
  } catch (error) {
    console.error('사용자 후기 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 공개 프로필 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 프로필 데이터 { userId, nickname, profileImage, rating, reviewCount, completedMeetings, attendanceRate, joinDate }
 */
export const getPublicProfile = async userId => {
  try {
    const response = await axiosInstance.get(`/auth/${userId}/public-profile`);
    
    // 프로필 이미지 URL 변환 (Android localhost 보정)
    if (response && response.profileImageUrl) {
      return {
        ...response,
        profileImageUrl: normalizeImageUrl(response.profileImageUrl),
      };
    }
    
    return response;
  } catch (error) {
    console.error('공개 프로필 조회 실패:', error);
    throw error;
  }
};
