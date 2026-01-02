import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Bell, AlertCircle} from 'lucide-react-native';
import styles from '../../styles/screens/settings/NotificationSettingsStyles';
import {colors} from '../../styles/common';

/**
 * 알림 설정 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "알림 설정" 타이틀
 * - 알림 권한 상태 카드: 현재 권한 상태 표시
 * - 사용 목적 카드: 알림이 사용되는 기능들
 * - 권한 설정 안내 박스
 * - 하단 권한 허용하기 버튼
 */
export default function NotificationSettingsScreen({navigation}) {
  const [permissionStatus, setPermissionStatus] = useState('미설정');

  useEffect(() => {
    checkNotificationPermission();

    // 화면 포커스 시 권한 상태 재확인
    const unsubscribe = navigation.addListener('focus', () => {
      checkNotificationPermission();
    });

    return unsubscribe;
  }, [navigation]);

  // 알림 권한 확인
  const checkNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        setPermissionStatus(granted ? '허용됨' : '미설정');
      } else {
        // iOS는 권한 상태를 직접 확인할 수 없으므로 미설정으로 표시
        setPermissionStatus('미설정');
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      setPermissionStatus('미설정');
    }
  };

  // 권한 허용하기
  const handleRequestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // Android 권한 확인
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted) {
          Alert.alert('알림', '이미 알림 권한이 허용되어 있습니다.');
          return;
        }

        // 권한 요청
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus('허용됨');
          Alert.alert('완료', '알림 권한이 허용되었습니다.');
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setPermissionStatus('차단됨');
          Alert.alert(
            '권한 설정 필요',
            '알림 권한이 차단되어 있습니다.\n설정에서 권한을 허용해주세요.',
            [
              {text: '취소', style: 'cancel'},
              {
                text: '설정으로 이동',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        } else {
          setPermissionStatus('거부됨');
          Alert.alert('알림', '알림 권한이 거부되었습니다.');
        }
      } else {
        // iOS는 설정으로 바로 이동
        Alert.alert(
          '알림 권한 설정',
          'iOS에서는 설정 앱에서 알림 권한을 허용해주세요.',
          [
            {text: '취소', style: 'cancel'},
            {
              text: '설정으로 이동',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }

      // 권한 상태 재확인
      await checkNotificationPermission();
    } catch (error) {
      console.error('권한 요청 실패:', error);
      Alert.alert('오류', '권한 요청 중 문제가 발생했습니다.');
    }
  };

  // 상태에 따른 색상
  const getStatusColor = () => {
    switch (permissionStatus) {
      case '허용됨':
        return colors.success;
      case '차단됨':
      case '거부됨':
        return colors.error;
      default:
        return '#4a5565';
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 설정</Text>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 알림 권한 상태 카드 */}
        <LinearGradient
          colors={['#FDF2F8', '#FAF5FF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.statusCard}>
          <View style={styles.statusCardContent}>
            <LinearGradient
              colors={['#FFF7B7', '#F8874A']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.statusIcon}>
              <Bell size={28} color={colors.white} strokeWidth={2} />
            </LinearGradient>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>알림 권한 상태</Text>
              <View style={styles.statusRow}>
                <AlertCircle
                  size={14}
                  color={getStatusColor()}
                  strokeWidth={2}
                />
                <Text style={[styles.statusText, {color: getStatusColor()}]}>
                  {permissionStatus}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 사용 목적 카드 */}
        <View style={styles.purposeCard}>
          <Text style={styles.purposeTitle}>사용 목적</Text>
          <View style={styles.purposeList}>
            <View style={styles.purposeItem}>
              <LinearGradient
                colors={['#98D8FF', '#698FEE']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.purposeNumber}>
                <Text style={styles.purposeNumberText}>1</Text>
              </LinearGradient>
              <Text style={styles.purposeText}>게시글 좋아요 알림</Text>
            </View>
            <View style={styles.purposeItem}>
              <LinearGradient
                colors={['#98D8FF', '#698FEE']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.purposeNumber}>
                <Text style={styles.purposeNumberText}>2</Text>
              </LinearGradient>
              <Text style={styles.purposeText}>신고 알림</Text>
            </View>
            <View style={styles.purposeItem}>
              <LinearGradient
                colors={['#98D8FF', '#698FEE']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.purposeNumber}>
                <Text style={styles.purposeNumberText}>3</Text>
              </LinearGradient>
              <Text style={styles.purposeText}>같이 장보기 알림</Text>
            </View>
          </View>
        </View>

        {/* 권한 설정 안내 박스 */}
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>💡 권한 설정 안내</Text>
          <View style={styles.guideList}>
            <Text style={styles.guideItem}>
              • 권한을 거부하면 일부 기능을 사용할 수 없습니다
            </Text>
            <Text style={styles.guideItem}>
              • 권한은 언제든지 변경할 수 있습니다
            </Text>
            <Text style={styles.guideItem}>
              • 앱 설정에서 권한을 관리할 수 있습니다
            </Text>
          </View>
        </View>

        {/* 권한 허용하기 버튼 */}
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handleRequestPermission}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#00B8DB', '#155DFC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.permissionButtonGradient}>
            <Text style={styles.permissionButtonText}>권한 허용하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
