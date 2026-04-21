import axios from 'axios';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const SERVER_IP = Config.SERVER_IP || 'localhost:8090';
export const SERVER_PORT = '';
export const SERVER_BASE_URL = Config.SERVER_BASE_URL || `https://${SERVER_IP}`;

const BASE_URL = `${SERVER_BASE_URL}/api`;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (Request Interceptor)
api.interceptors.request.use(
  async config => {
    try {
      config.metadata = {startTime: new Date()};

      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (__DEV__) {
        console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error),
);

// 응답 인터셉터 (Response Interceptor)
// 에러 처리 및 토큰 갱신 등
api.interceptors.response.use(
  response => {
    // 응답 시간 계산
    const duration = response.config.metadata?.startTime
      ? new Date() - response.config.metadata.startTime
      : 0;

    if (__DEV__) {
      console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }

    return response.data;
  },
  async error => {
    // 응답 시간 계산
    const duration = error.config?.metadata?.startTime
      ? new Date() - error.config.metadata.startTime
      : 0;

    // 응답이 있는 경우 (서버 에러)
    if (error.response) {
      const {status, data} = error.response;

      if (__DEV__) {
        console.log(`❌ ${status} ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`);
      }

      if (status === 401) {
        await AsyncStorage.multiRemove([
          'accessToken',
          'refreshToken',
          'userId',
          'userEmail',
          'userName',
          'userNickname',
          'userType',
          'userStatus',
          'profileImage',
        ]);
      }
    }
    // 응답이 없는 경우 (네트워크 에러)
    else if (error.request) {
      if (__DEV__) {
        console.log(`❌ Network Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      }
    } else {
      if (__DEV__) {
        console.log('❌ Error:', error.message);
      }
    }

    return Promise.reject(error);
  },
);
export default api;
