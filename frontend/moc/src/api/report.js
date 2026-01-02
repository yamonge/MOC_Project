import api from './axiosConfig';

/**
 * 레시피 신고 API
 * POST /api/v1/users/{reporterUserId}/recipe-reports
 *
 * @param {number} reporterUserId - 신고하는 사용자 ID
 * @param {number} recipeId - 신고할 레시피 ID
 * @param {string} reportReasonCd - 신고 사유 코드
 * @param {string} [content] - 상세 내용 (선택)
 * @returns {Promise<Object>} 신고 결과
 *
 * @example
 * await reportRecipe(1, 123, 'INAPPROPRIATE_CONTENT', '욕설이 포함되어 있습니다.');
 */
export const reportRecipe = async (
  reporterUserId,
  recipeId,
  reportReasonCd,
  content = '',
) => {
  try {
    const data = await api.post(`/v1/users/${reporterUserId}/recipe-reports`, {
      recipeId,
      reportReasonCd,
      content: content.trim() || null,
    });
    return data;
  } catch (error) {
    console.error('레시피 신고 실패:', error);
    throw error;
  }
};

/**
 * 사용자 신고 API
 * POST /api/v1/users/{reporterUserId}/user-reports
 *
 * @param {number} reporterUserId - 신고하는 사용자 ID
 * @param {number} reportedUserId - 신고할 사용자 ID
 * @param {string} reportReasonCd - 신고 사유 코드
 * @param {string} [reportComment] - 상세 내용 (선택)
 * @returns {Promise<Object>} 신고 결과
 *
 * @example
 * await reportUser(1, 456, 'PROFANITY', '욕설 사용');
 */
export const reportUser = async (
  reporterUserId,
  reportedUserId,
  reportReasonCd,
  reportComment = '',
) => {
  try {
    const data = await api.post(`/v1/users/${reporterUserId}/user-reports`, {
      reportedUserId,
      reportReasonCd,
      reportComment: reportComment.trim() || null,
    });
    return data;
  } catch (error) {
    console.error('사용자 신고 실패:', error);
    throw error;
  }
};

/**
 * 신고한 레시피 목록 조회
 * GET /api/v1/users/{reporterUserId}/recipe-reports
 */
export const getMyRecipeReports = async reporterUserId => {
  try {
    const data = await api.get(`/v1/users/${reporterUserId}/recipe-reports`);
    return data;
  } catch (error) {
    console.error('레시피 신고 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 신고한 사용자 목록 조회
 * GET /api/v1/users/{reporterUserId}/user-reports
 */
export const getMyUserReports = async reporterUserId => {
  try {
    const data = await api.get(`/v1/users/${reporterUserId}/user-reports`);
    return data;
  } catch (error) {
    console.error('사용자 신고 목록 조회 실패:', error);
    throw error;
  }
};
