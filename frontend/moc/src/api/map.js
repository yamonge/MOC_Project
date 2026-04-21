import api from './axiosConfig';

/**
 * 네이버 좌표를 WGS84 위도로 변환
 * @param {string} naverY - 네이버 Y 좌표
 * @returns {number} WGS84 위도
 */
const convertToWGS84Lat = naverY => {
  return parseFloat(naverY) / 10000000;
};

/**
 * 네이버 좌표를 WGS84 경도로 변환
 * @param {string} naverX - 네이버 X 좌표
 * @returns {number} WGS84 경도
 */
const convertToWGS84Lng = naverX => {
  return parseFloat(naverX) / 10000000;
};

/**
 * 백엔드를 통한 네이버 장소 검색 API 호출
 * @param {string} query - 검색어 (예: "천안 마트")
 * @param {number} display - 검색 결과 개수 (기본 20개)
 * @returns {Promise<Array>} 검색된 장소 목록
 */
export const searchPlaces = async (query, display = 20) => {
  try {
    const response = await api.get('/map/search', {
      params: {
        query: query,
        display: display,
      },
    });

    // 백엔드에서 받은 네이버 API 응답 가공
    const places = response.items.map(item => {
      const lat = convertToWGS84Lat(item.mapy);
      const lng = convertToWGS84Lng(item.mapx);

      return {
        name: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
        address: item.address,
        roadAddress: item.roadAddress,
        category: item.category,
        latitude: lat,
        longitude: lng,
      };
    });

    return places;
  } catch (error) {
    console.error('백엔드 장소 검색 API 호출 실패:', error);
    throw error;
  }
};

/**
 * 백엔드를 통한 네이버 클라우드 Reverse Geocoding API 호출
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise<string>} 지역명 (예: "천안시")
 */
export const reverseGeocode = async (latitude, longitude) => {
  console.log('[Reverse Geocoding 시작]', `lat=${latitude}, lng=${longitude}`);

  try {
    const coords = `${longitude},${latitude}`;
    console.log('[Reverse Geocoding 요청]', `coords=${coords}`);

    const response = await api.get('/map/reverse-geocode', {
      params: {
        coords: coords,
        orders: 'roadaddr',
        output: 'json',
      },
    });

    console.log('[Reverse Geocoding 응답]', JSON.stringify(response, null, 2));

    // 응답 데이터 확인
    if (response.status.code !== 0) {
      console.error('[백엔드 Reverse Geocoding 실패]', response.status.message);
      return '';
    }

    const results = response.results;
    if (results && results.length > 0) {
      const region = results[0].region;
      const area2 = region.area2.name; // 시/군/구
      const area1 = region.area1.name; // 시/도

      console.log('[Reverse Geocoding 성공]', `${area1} ${area2}`);
      return area2 || area1;
    }

    console.log('[Reverse Geocoding] 결과 없음');
    return '';
  } catch (error) {
    console.error('[백엔드 Reverse Geocoding API 호출 실패]', error.message);
    if (error.response) {
      console.error(
        '[Reverse Geocoding 에러 응답]',
        JSON.stringify(error.response, null, 2),
      );
    }
    return '';
  }
};

// ============================================
// 게시물 API
// ============================================

/**
 * 특정 마트(핀) 기준 게시물 조회
 * 백엔드: GET /api/shopping-posts/place?lat=&lng=
 */
export const getPostsByLocation = async (storeName, latitude, longitude) => {
  return api.get('/shopping-posts/place', {
    params: {
      lat: latitude,
      lng: longitude,
    },
  });
};

/**
 * 게시물 작성
 * 백엔드: POST /api/shopping-posts
 */
export const createPost = async postData => {
  return api.post('/shopping-posts', postData);
};

/**
 * 게시물 참여
 * 백엔드: POST /api/shopping-posts/{postId}/join
 */
export const joinPost = async postId => {
  return api.post(`/shopping-posts/${postId}/join`);
};
