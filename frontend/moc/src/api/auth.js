import api from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GOOGLE_WEB_CLIENT_ID} from '@env';

/**
 * FCM 토큰 가져오기
 * @returns {Promise<string|null>} FCM 토큰
 */
const getFCMToken = async () => {
  try {
    return await messaging().getToken();
  } catch (error) {
    if (__DEV__) console.error('[FCM 토큰 가져오기 실패]', error);
    return null;
  }
};

/**
 * 구글 로그인 SDK 초기화
 */
export const initGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

/**
 * 구글 로그인 실행
 * @returns {Promise<{idToken: string, user: object}>}
 */
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    const userInfo = response.data || response;

    // idToken이 없으면 serverAuthCode 사용 시도
    const tokenToUse = userInfo.idToken || userInfo.serverAuthCode;

    if (!tokenToUse) {
      throw new Error('Google ID Token 또는 ServerAuthCode를 받지 못했습니다.');
    }

    return {
      idToken: tokenToUse,
      user: userInfo.user,
    };
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    throw error;
  }
};

/**
 * 페이스북 로그인 실행
 * @returns {Promise<{accessToken: string}>}
 */
export const signInWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw new Error('사용자가 로그인을 취소했습니다.');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('액세스 토큰을 가져올 수 없습니다.');
    }

    return {
      accessToken: data.accessToken,
    };
  } catch (error) {
    console.error('페이스북 로그인 에러:', error);
    throw error;
  }
};

/**
 * 인증 관련 API
 * 백엔드 개발자가 제공하는 API 엔드포인트에 맞춰 수정 필요
 */
export const authAPI = {
  /**
   * 일반 로그인 (이메일 + 비밀번호)
   * 백엔드: POST /api/auth/login
   * Request: { userEmail, userPassword }
   * Response: LoginResponseDTO 또는 { user: LoginResponseDTO }
   */
  login: async (email, password) => {
    try {
      // FCM 토큰 가져오기
      const fcmToken = await getFCMToken();

      const response = await api.post('/auth/login', {
        userEmail: email,
        userPassword: password,
        fcmToken: fcmToken, // FCM 토큰 추가
      });

      await AsyncStorage.multiSet([
        ['accessToken', response?.accessToken ?? ''],
        ['refreshToken', response?.refreshToken ?? ''],
        ['userId', response?.userId ? String(response.userId) : ''],
        ['userEmail', response?.userEmail ?? ''],
        ['userName', response?.userName ?? ''],
        ['userNickname', response?.userNickname ?? ''],
        ['userType', response?.userType ?? ''],
        ['userStatus', response?.userStatus ?? ''],
      ]);

      return response;
    } catch (error) {
      if (__DEV__) console.error('로그인 에러:', error?.message, error?.response?.status);
      throw error;
    }
  },

  /**
   * 구글 소셜 로그인
   * @param {string} idToken - 구글에서 받은 ID 토큰
   * @returns {Promise} 로그인 결과
   */
  googleLogin: async idToken => {
    try {
      // FCM 토큰 가져오기
      const fcmToken = await getFCMToken();

      const response = await api.post('/auth/google', {
        idToken,
        fcmToken,
        deviceOs: Platform.OS === 'ios' ? 'iOS' : 'Android',
        deviceVersion: String(Platform.Version || ''),
      });

      await AsyncStorage.multiSet([
        ['accessToken', response?.accessToken ?? ''],
        ['refreshToken', response?.refreshToken ?? ''],
        ['userId', response?.userId ? String(response.userId) : ''],
        ['userEmail', response?.userEmail ?? ''],
        ['userName', response?.userName ?? ''],
        ['userNickname', response?.userNickname ?? ''],
        ['userType', response?.userType ?? ''],
        ['userStatus', response?.userStatus ?? ''],
      ]);

      return response;
    } catch (error) {
      console.error('구글 로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 페이스북 소셜 로그인
   * @param {string} accessToken - 페이스북에서 받은 액세스 토큰
   * @returns {Promise} 로그인 결과
   */
  facebookLogin: async accessToken => {
    try {
      // FCM 토큰 가져오기
      const fcmToken = await getFCMToken();

      const response = await api.post('/auth/facebook', {
        accessToken,
        fcmToken,
        deviceOs: Platform.OS === 'ios' ? 'iOS' : 'Android',
        deviceVersion: String(Platform.Version || ''),
      });

      await AsyncStorage.multiSet([
        ['accessToken', response?.accessToken ?? ''],
        ['refreshToken', response?.refreshToken ?? ''],
        ['userId', response?.userId ? String(response.userId) : ''],
        ['userEmail', response?.userEmail ?? ''],
        ['userName', response?.userName ?? ''],
        ['userNickname', response?.userNickname ?? ''],
        ['userType', response?.userType ?? ''],
        ['userStatus', response?.userStatus ?? ''],
      ]);

      return response;
    } catch (error) {
      console.error('페이스북 로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 카카오 소셜 로그인
   * @param {string} accessToken - 카카오에서 받은 액세스 토큰
   * @returns {Promise} 로그인 결과
   */
  kakaoLogin: async accessToken => {
    try {
      const response = await api.post('/auth/kakao', {
        accessToken,
      });

      // 사용자 정보 저장
      if (response.user) {
        await AsyncStorage.setItem('userEmail', response.user.email || '');
        await AsyncStorage.setItem(
          'userNickname',
          response.user.nickname || '',
        );
        await AsyncStorage.setItem('userName', response.user.name || '');
      }

      return response;
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      // 로컬 저장소에서 사용자 정보 삭제
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userId',
        'userEmail',
        'userName',
        'userNickname',
        'userType',
        'userStatus',
        'userRole',
        'profileImage',
      ]);

      return {success: true};
    } catch (error) {
      console.error('로그아웃 에러:', error);
      // 에러가 발생해도 사용자 정보는 삭제
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userId',
        'userEmail',
        'userName',
        'userNickname',
        'userType',
        'userStatus',
        'userRole',
        'profileImage',
      ]);
      throw error;
    }
  },

  /**
   * 현재 로그인한 사용자 정보 가져오기
   * @returns {Promise} 사용자 정보
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error('사용자 정보 조회 에러:', error);
      throw error;
    }
  },

  /**
   * 회원가입
   * SignupScreen에서 DTO 형식에 맞게 userData 구성해서 넘겨줌
   */
  signup: async userData => {
    try {
      // FCM 토큰 가져오기
      const fcmToken = await getFCMToken();

      const response = await api.post('/auth/signup', {
        ...userData,
        fcmToken: fcmToken, // FCM 토큰 추가
      });
      return response;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },

  /**
   * 이메일 중복 체크
   * 백엔드: GET /api/auth/check-email?email=...
   * Response: true = 중복, false = 사용 가능
   */
  checkEmail: async email => {
    try {
      // ✅ GET + query param 방식으로 호출
      const duplicate = await api.get('/auth/check-email', {
        params: {email},
      });

      // axiosConfig 응답 인터셉터에서 response.data만 넘기므로
      // duplicate는 boolean (true/false)
      // 프론트는 { available: boolean } 형식을 기대하니까 이렇게 감싸서 반환
      return {available: !duplicate}; // true = 사용 가능
    } catch (error) {
      console.error(
        '이메일 중복 체크 에러:',
        error.message,
        error.response?.status,
        error.response?.data,
      );
      throw error;
    }
  },

  /**
   * 닉네임 중복 체크
   */
  checkNickname: async nickname => {
    try {
      const response = await api.post('/auth/check-nickname', {
        userNickname: nickname,
      });
      if (typeof response.available !== 'boolean') {
        return {available: false};
      }
      return response; // { available: true/false } 형태면 그대로
    } catch (error) {
      console.error(
        '닉네임 중복 체크 에러:',
        error.message,
        error.response?.status,
        error.response?.data,
      );
      throw error;
    }
  },

  /**
   * 아이디(이메일) 찾기 (이름 + 생년월일)
   * POST /api/auth/find-email
   * Request: { userName, userBirthDate }
   * Response: { userEmail }
   */
  findEmail: async (userName, userBirthDate) => {
    try {
      // userBirthDate는 Date 객체라고 가정
      const timestamp = userBirthDate.toISOString();

      // axiosConfig 인터셉터가 response.data만 반환
      // 여기서의 response는 이미 FindEmailResponseDTO 형태임
      const response = await api.post('/auth/find-email', {
        userName,
        userBirthDate: timestamp,
      });

      return response; // response == { userEmail: "마스킹된 이메일" }
    } catch (error) {
      // 404 같은 예상 실패는 console.error로 찍지 않는 편이 좋음
      const status = error?.response?.status;
      if (![400, 401, 403, 404].includes(status)) {
        console.error('아이디 찾기 에러:', error);
      }
      throw error;
    }
  },

  /**
   * 임시 비밀번호 발송 (이메일 + 이름 + 생년월일)
   *비밀번호 재설정 링크 발송
   * POST /api/auth/find-password
   * Request: { userEmail, userName, userBirthDate }
   */
  sendPasswordResetLink: async (email, name, birthDate) => {
    try {
      const response = await api.post('/auth/find-password', {
        userEmail: email,
        userName: name,
        userBirthDate: birthDate, // 'YYYY-MM-DD'
      });
      return response;
    } catch (error) {
      console.error('임시 비밀번호 발송 에러:', error);
      throw error;
    }
  },

  /**
   * 비밀번호 재설정 (토큰 확인 후 새 비번 저장)
   * POST /api/auth/reset-password
   * Request: { token, newPassword, newPasswordConfirm }
   */
  resetPasswordByToken: ({token, newPassword, newPasswordConfirm}) =>
    api.post('/auth/reset-password', {
      token,
      newPassword,
      newPasswordConfirm,
    }),
};

export default authAPI;
