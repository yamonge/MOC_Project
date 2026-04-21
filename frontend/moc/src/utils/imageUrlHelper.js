import {SERVER_BASE_URL} from '../api/axiosConfig';

/**
 * 이미지 URL 정규화 (개발 환경 폴백용)
 *
 * 프로덕션(AWS)에서는 백엔드가 올바른 절대 URL을 반환하므로 이 함수는 그대로 통과시킴.
 * 개발 환경에서 백엔드가 localhost/사설IP URL을 반환하는 경우에만
 * .env의 SERVER_BASE_URL로 치환하는 안전장치 역할.
 *
 * @param {string} imageUrl - 변환할 이미지 URL
 * @returns {string} 변환된 이미지 URL
 */
export const normalizeImageUrl = imageUrl => {
  if (!imageUrl) return imageUrl;

  if (imageUrl.includes('localhost:8090') || imageUrl.includes('192.168.')) {
    return imageUrl.replace(
      /https?:\/\/(localhost|192\.168\.\d+\.\d+):8090/,
      SERVER_BASE_URL,
    );
  }

  return imageUrl;
};

/**
 * 레시피 객체의 이미지 URL들을 일괄 변환
 * 
 * @param {Object} recipe - 레시피 객체
 * @returns {Object} 이미지 URL이 변환된 레시피 객체
 */
export const normalizeRecipeImages = recipe => {
  if (!recipe) return recipe;
  
  const normalized = {...recipe};
  
  // 썸네일 이미지 변환
  if (normalized.thumbnailUrl) {
    normalized.thumbnailUrl = normalizeImageUrl(normalized.thumbnailUrl);
  }
  
  // 작성자 프로필 이미지 변환
  if (normalized.authorProfileImageUrl) {
    normalized.authorProfileImageUrl = normalizeImageUrl(
      normalized.authorProfileImageUrl,
    );
  }
  
  return normalized;
};

