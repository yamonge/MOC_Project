import {Platform} from 'react-native';
import {SERVER_IP, SERVER_PORT, SERVER_BASE_URL} from '../api/axiosConfig';

/**
 * 이미지 URL 변환 (ngrok URL 보정)
 * 백엔드에서 반환된 localhost URL을 ngrok URL로 변환
 * 
 * @param {string} imageUrl - 변환할 이미지 URL
 * @returns {string} 변환된 이미지 URL
 * 
 * @example
 * const normalizedUrl = normalizeImageUrl('http://localhost:8090/image.jpg');
 * // 'https://f6aa9ba6797e.ngrok-free.app/image.jpg'
 */
export const normalizeImageUrl = imageUrl => {
  if (!imageUrl) return imageUrl;
  
  // localhost URL을 ngrok URL로 변환
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

