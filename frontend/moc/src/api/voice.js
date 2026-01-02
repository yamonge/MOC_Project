import axiosInstance from './axiosConfig';

/**
 * Voice API
 * 음성 인식 관련 API
 */

/**
 * 음성 파일 전송 및 텍스트 변환 (OpenAI Whisper)
 * @param {string} audioFilePath - 녹음된 음성 파일 경로
 * @returns {Promise<{text: string}>} - 인식된 텍스트
 */
export const sendVoiceRecording = async audioFilePath => {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioFilePath,
      type: 'audio/mp4',
      name: 'voice.mp4',
    });

    const response = await axiosInstance.post('/v1/voice/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // axiosConfig에서 이미 response.data 반환함
  } catch (error) {
    console.error('음성 인식 실패:', error);
    throw error;
  }
};

/**
 * 음성으로 레시피 검색 (유튜브 쇼츠 리스트)
 * @param {string} recipeName - 인식된 요리명
 * @returns {Promise<Array>} - 유튜브 쇼츠 리스트
 */
export const getRecipeByVoice = async recipeName => {
  try {
    const response = await axiosInstance.get('/v1/voice/recipe', {
      params: {
        name: recipeName,
      },
    });
    return response; // axiosConfig에서 이미 response.data 반환함
  } catch (error) {
    console.error('레시피 검색 실패:', error);
    throw error;
  }
};

/**
 * 유튜브 쇼츠 상세 조회
 * @param {string} videoId - 유튜브 비디오 ID
 * @returns {Promise<Object>} - 유튜브 쇼츠 상세 정보
 */
export const getYoutubeShortDetail = async videoId => {
  try {
    const response = await axiosInstance.get(`/v1/voice/shorts/${videoId}`);
    return response; // axiosConfig에서 이미 response.data 반환함
  } catch (error) {
    console.error('유튜브 쇼츠 상세 조회 실패:', error);
    throw error;
  }
};
