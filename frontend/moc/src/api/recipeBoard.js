import api from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {normalizeRecipeImages} from '../utils/imageUrlHelper';

// ✅ 레시피 공통 정규화 함수 (여기 딱 1번만)
const normalizeRecipe = recipe => {
  if (!recipe) return recipe;

  const r = normalizeRecipeImages(recipe);

  // 난이도 한글화
  r.difficultyText =
    r.difficultyCd === 'EASY'
      ? '쉬움'
      : r.difficultyCd === 'NORMAL'
      ? '보통'
      : r.difficultyCd === 'HARD'
      ? '어려움'
      : r.difficultyCd;

  return r;
};

/**
 * 레시피 목록 조회 API
 *
 * @param {Object} params - 검색 및 필터 조건
 * @param {string} [params.search] - 검색어 (선택)
 * @param {string} [params.style] - 요리 스타일 (선택) - 예: '한식', '중식', '일식', '양식', '퓨전'
 * @param {string} [params.difficulty] - 난이도 (선택) - 예: '하', '중', '상'
 * @param {string} [params.time] - 조리시간 (선택) - 예: '10분 이내', '30분 이내', '1시간 이내', '1시간 이상'
 *
 * @returns {Promise<Object>} 레시피 목록
 * @returns {Array} recipes - 레시피 배열
 * @returns {number} recipes[].id - 레시피 ID
 * @returns {string} recipes[].title - 레시피 제목
 * @returns {string} recipes[].author - 작성자 이름
 * @returns {number} recipes[].cookingTime - 조리 시간 (분)
 * @returns {string} recipes[].difficulty - 난이도 ('하', '중', '상')
 * @returns {number} recipes[].likeCount - 좋아요 수
 * @returns {boolean} recipes[].isLiked - 현재 사용자의 좋아요 여부 (JWT 토큰 기반)
 * @returns {Array<string>} recipes[].ingredients - 재료 목록
 * @returns {string|null} recipes[].image - 레시피 이미지 URL (없으면 null)
 *
 * @example
 * // 전체 레시피 조회
 */

export const getRecipeBoardList = async ({
  search,
  cuisineStyleCd,
  difficultyCd,
  maxCookTimeMin,
  sort = 'LATEST', // LATEST | POPULAR
  page = 1,
  size = 10,
} = {}) => {
  try {
    // ✅ 현재 로그인한 사용자 ID 가져오기
    const userId = await AsyncStorage.getItem('userId');

    const response = await api.get('/v1/recipes/board', {
      params: {
        loginUserId: userId ? Number(userId) : undefined, // ✅ 백엔드에 전달
        search,
        cuisineStyleCd,
        difficultyCd,
        maxCookTimeMin,
        sort,
        page: page - 1,
        size,
      },
    });
    
    // items 배열의 각 레시피를 정규화
    if (response.items && Array.isArray(response.items)) {
      response.items = response.items.map(recipe => {
        const normalized = normalizeRecipe(recipe);
        // 디버깅: 작성자 프로필 이미지 URL 확인
        if (normalized.authorProfileImageUrl) {
          console.log('✅ [recipeBoard] authorProfileImageUrl:', normalized.authorProfileImageUrl);
        } else {
          console.log('⚠️ [recipeBoard] authorProfileImageUrl 없음:', normalized);
        }
        return normalized;
      });
    }
    
    return response; // RecipeBoardListResponseDTO
  } catch (error) {
    console.error('게시판 레시피 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 레시피 상세 조회 API
 *
 * @param {number} recipeId - 레시피 ID
 *
 * @returns {Promise<Object>} 레시피 상세 정보
 * @returns {Object} recipe - 레시피 기본 정보
 * @returns {number} recipe.id - 레시피 ID
 * @returns {string} recipe.title - 레시피 제목
 * @returns {string} recipe.author - 작성자 이름
 * @returns {number} recipe.cookingTime - 조리 시간 (분)
 * @returns {string} recipe.difficulty - 난이도 ('하', '중', '상')
 * @returns {number} recipe.likeCount - 좋아요 수
 * @returns {boolean} recipe.isLiked - 현재 사용자의 좋아요 여부
 * @returns {string|null} recipe.image - 레시피 이미지 URL
 * @returns {Array<Object>} ingredients - 재료 목록
 * @returns {string} ingredients[].name - 재료명
 * @returns {string} ingredients[].amount - 재료 양
 * @returns {Array<string>} steps - 조리 순서 (문자열 배열)
 *
 * @example
 * const data = await getRecipeDetail(123);
 * console.log(data.recipe.title); // "오징어 볶음밥"
 * console.log(data.ingredients); // [{name: "오징어", amount: "1마리"}, ...]
 * console.log(data.steps); // ["소고기를 썰어주세요.", ...]
 */
export const getRecipeBoardDetail = async recipeId => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const response = await api.get(`/v1/recipes/board/${recipeId}`, {
      params: {
        loginUserId: userId ? Number(userId) : undefined,
      },
    });
    console.log('📦 게시판 상세 API raw response:', response);
    
    // 레시피 상세 정보 정규화
    if (response) {
      return normalizeRecipe(response);
    }
    
    return response; // RecipeBoardDetailResponseDTO
  } catch (error) {
    console.error('게시판 레시피 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 레시피 좋아요 토글 API
 *
 * @param {number} recipeId - 레시피 ID
 *
 * @returns {Promise<Object>} 좋아요 결과
 * @returns {boolean} isLiked - 좋아요 상태 (true: 좋아요, false: 취소)
 * @returns {number} likeCount - 현재 좋아요 수
 *
 * @example
 * // 좋아요 토글
 * const result = await toggleRecipeLike(123);
 * console.log(result.isLiked); // true 또는 false
 * console.log(result.likeCount); // 999
 */
export const toggleRecipeLike = async (recipeId, userId) => {
  try {
    const response = await api.post(`/v1/users/${userId}/likes`, {
      recipeId: recipeId,
    });
    console.log('📦 좋아요 토글 API raw response:', response);
    return response; // ✅ interceptor가 이미 .data를 리턴함
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};
