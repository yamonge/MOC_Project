import axiosInstance from './axiosConfig';

/**
 * 후기 관련 API
 */

/**
 * 후기 작성
 * @param {number} writerUserId - 후기 작성자 ID
 * @param {object} reviewData - { targetUserId, shoppingPostId, rating, userReviewComment }
 * @returns {Promise<Object>} 작성된 후기 정보
 */
export const createReview = async (writerUserId, reviewData) => {
  try {
    const response = await axiosInstance.post(
      `/v1/users/${writerUserId}/reviews`,
      reviewData,
    );
    return response;
  } catch (error) {
    console.error('후기 작성 실패:', error);
    throw error;
  }
};

/**
 * 받은 후기 목록 조회
 * @param {number} targetUserId - 후기를 받은 사용자 ID
 * @returns {Promise<Object>} 후기 목록 { receivedReviews: [], totalCount: 0 }
 */
export const getReceivedReviews = async targetUserId => {
  try {
    const response = await axiosInstance.get(
      `/v1/users/${targetUserId}/reviews/received`,
    );
    return response;
  } catch (error) {
    console.error('받은 후기 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 받은 후기 개수 조회
 * @param {number} targetUserId - 후기를 받은 사용자 ID
 * @returns {Promise<number>} 후기 개수
 */
export const getReviewCount = async targetUserId => {
  try {
    const response = await axiosInstance.get(
      `/v1/users/${targetUserId}/reviews/count`,
    );
    return response;
  } catch (error) {
    console.error('받은 후기 개수 조회 실패:', error);
    throw error;
  }
};

/**
 * 후기 상세 조회
 * @param {number} writerUserId - 요청자 ID (권한 확인용)
 * @param {number} reviewId - 후기 ID
 * @returns {Promise<Object>} 후기 상세 정보
 */
export const getReviewDetail = async (writerUserId, reviewId) => {
  try {
    const response = await axiosInstance.get(
      `/v1/users/${writerUserId}/reviews/${reviewId}`,
    );
    return response;
  } catch (error) {
    console.error('후기 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 후기 수정
 * @param {number} writerUserId - 후기 작성자 ID
 * @param {number} reviewId - 후기 ID
 * @param {object} reviewData - { targetUserId, shoppingPostId, rating, userReviewComment }
 * @returns {Promise<Object>} 수정된 후기 정보
 */
export const updateReview = async (writerUserId, reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(
      `/v1/users/${writerUserId}/reviews/${reviewId}`,
      reviewData,
    );
    return response;
  } catch (error) {
    console.error('후기 수정 실패:', error);
    throw error;
  }
};

/**
 * 후기 삭제
 * @param {number} writerUserId - 후기 작성자 ID
 * @param {number} reviewId - 후기 ID
 * @returns {Promise<void>}
 */
export const deleteReview = async (writerUserId, reviewId) => {
  try {
    await axiosInstance.delete(`/v1/users/${writerUserId}/reviews/${reviewId}`);
  } catch (error) {
    console.error('후기 삭제 실패:', error);
    throw error;
  }
};
