import notifee, {TriggerType, AndroidImportance} from '@notifee/react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import {differenceInMinutes, parseISO} from 'date-fns';
import messaging from '@react-native-firebase/messaging';

/**
 * Notifee 알림 서비스
 * - 로컬 알림 초기화 및 관리
 * - 약속 30분 전 알림 스케줄링
 * - FCM 푸시 알림 수신 및 표시
 */

/**
 * 알림 채널 생성 (Android 전용)
 */
const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'shopping-reminder',
      name: '장보기 알림',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }
};

/**
 * 알림 권한 요청
 * @returns {Promise<boolean>} 권한 허용 여부
 */
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      // Android 13 (API 33) 이상에서만 권한 필요
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // Android 12 이하는 권한 불필요
    } else {
      // iOS
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= 1; // 1 = Authorized
    }
  } catch (error) {
    if (__DEV__) console.error('[알림 권한 요청 실패]', error);
    return false;
  }
};

/**
 * Notifee 초기화
 */
export const initNotification = async () => {
  try {
    await createNotificationChannel();
    if (__DEV__) console.log('[Notifee 초기화 완료]');
  } catch (error) {
    if (__DEV__) console.error('[Notifee 초기화 실패]', error);
  }
};

/**
 * 약속 30분 전 알림 스케줄링
 * @param {string} postId - 게시물 ID
 * @param {string} storeName - 마트명
 * @param {string} meetTimeString - 약속 시간 문자열 (예: "오늘 오후 12:35")
 * @param {Date} meetTimeDate - 약속 시간 Date 객체
 * @returns {Promise<string|null>} 알림 ID (취소 시 사용)
 */
export const scheduleMeetingNotification = async (
  postId,
  storeName,
  meetTimeString,
  meetTimeDate,
) => {
  try {
    // 30분 전 시간 계산
    const notificationTime = new Date(meetTimeDate.getTime() - 30 * 60 * 1000);
    const now = new Date();

    if (notificationTime <= now) {
      if (__DEV__) console.warn('[알림 시간 지남] 알림을 예약할 수 없습니다.');
      return null;
    }

    // 알림 생성
    const notificationId = await notifee.createTriggerNotification(
      {
        id: `meeting-${postId}`, // 고유 ID (취소 시 사용)
        title: '🛒 장보기 30분 전!',
        body: `${storeName}에서 ${meetTimeString}에 만나요!`,
        data: {
          chatRoomId: String(postId), // 🔥 채팅방 ID 추가
          storeName: storeName,
          type: 'MEETING',
        },
        android: {
          channelId: 'shopping-reminder',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTime.getTime(),
      },
    );

    if (__DEV__) console.log('[알림 예약 완료]', {notificationId, scheduledTime: notificationTime.toISOString()});

    return notificationId;
  } catch (error) {
    if (__DEV__) console.error('[알림 예약 실패]', error);
    return null;
  }
};

/**
 * 특정 게시물의 알림 취소 (채팅방 나가기 시 사용)
 * @param {string} postId - 게시물 ID
 */
export const cancelMeetingNotification = async postId => {
  try {
    const notificationId = `meeting-${postId}`;
    await notifee.cancelNotification(notificationId);
    if (__DEV__) console.log('[알림 취소 완료]', notificationId);
  } catch (error) {
    if (__DEV__) console.error('[알림 취소 실패]', error);
  }
};

/**
 * FCM 푸시 알림을 로컬 알림으로 표시 (앱 실행 중)
 * @param {Object} remoteMessage - FCM 메시지 객체
 */
export const displayFCMNotification = async remoteMessage => {
  try {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || '알림',
      body: remoteMessage.notification?.body || '',
      android: {
        channelId: 'shopping-reminder',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        // FCM 데이터를 전달하여 클릭 시 사용
        data: remoteMessage.data,
      },
      ios: {
        sound: 'default',
      },
      data: remoteMessage.data, // 클릭 이벤트에서 사용할 데이터
    });

    if (__DEV__) console.log('[FCM 알림 표시 완료]', remoteMessage.notification?.title);
  } catch (error) {
    if (__DEV__) console.error('[FCM 알림 표시 실패]', error);
  }
};

/**
 * FCM 초기 설정
 */
export const setupFCM = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      if (__DEV__) console.warn('[FCM] 알림 권한이 없습니다.');
      return;
    }

    const fcmToken = await messaging().getToken();
    if (__DEV__) console.log('[FCM Token]', fcmToken);

    return fcmToken;
  } catch (error) {
    if (__DEV__) console.error('[FCM 초기화 실패]', error);
    return null;
  }
};
