import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import {X} from 'lucide-react-native';
import AudioRecorderPlayer from 'react-native-nitro-sound';
import {sendVoiceRecording} from '../../api/voice';
import PermissionModal from '../../components/common/PermissionModal';
import styles from '../../styles/screens/voice/VoiceScreenStyles';

/**
 * Voice Screen
 * 음성 인식을 통한 레시피 검색 화면
 *
 * 3가지 상태:
 * 1. idle: 초기 상태 (버튼을 눌러 말하기)
 * 2. listening: 음성 인식 중 (듣고 있어요...)
 * 3. recognized: 인식 완료 (제육볶음 + 버튼 2개)
 */
export default function VoiceScreen({navigation}) {
  // 상태 관리
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'recognized'
  const [recognizedText, setRecognizedText] = useState('');
  const [audioFilePath, setAudioFilePath] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5); // 남은 시간 (초)

  // AudioRecorderPlayer 인스턴스
  const audioRecorderPlayer = useRef(AudioRecorderPlayer).current;

  // 자동 종료 타이머 ref
  const autoStopTimer = useRef(null);
  const countdownTimer = useRef(null);

  // 애니메이션 값
  const overlay01X = useSharedValue(0);
  const overlay01Y = useSharedValue(0);
  const overlay02X = useSharedValue(0);
  const overlay02Y = useSharedValue(0);
  const micScale = useSharedValue(1);
  const micRotate = useSharedValue(0);

  // 배경 원 애니메이션 (overlay01, overlay02)
  useEffect(() => {
    // overlay01: 천천히 좌우 + 상하 움직임
    overlay01X.value = withRepeat(
      withTiming(15, {duration: 4000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    overlay01Y.value = withRepeat(
      withTiming(20, {duration: 5000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );

    // overlay02: 천천히 좌우 + 상하 움직임 (다른 속도)
    overlay02X.value = withRepeat(
      withTiming(-10, {duration: 5000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    overlay02Y.value = withRepeat(
      withTiming(-15, {duration: 4500, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, []);

  // 음성 인식 중일 때 마이크 펄스 애니메이션
  useEffect(() => {
    if (voiceState === 'listening') {
      micScale.value = withRepeat(
        withSpring(1.1, {damping: 2, stiffness: 80}),
        -1,
        true,
      );
    } else {
      micScale.value = withSpring(1);
    }
  }, [voiceState]);

  // 애니메이션 스타일
  const overlay01Style = useAnimatedStyle(() => ({
    transform: [{translateX: overlay01X.value}, {translateY: overlay01Y.value}],
  }));

  const overlay02Style = useAnimatedStyle(() => ({
    transform: [{translateX: overlay02X.value}, {translateY: overlay02Y.value}],
  }));

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: micScale.value}],
  }));

  // Android 권한 요청
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '음성 녹음 권한',
            message:
              '음성으로 레시피를 검색하기 위해 마이크 권한이 필요합니다.',
            buttonPositive: '확인',
            buttonNegative: '취소',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('권한 요청 실패:', err);
        return false;
      }
    }
    return true;
  };

  // 마이크 버튼 클릭 핸들러
  const handleMicPress = async () => {
    if (voiceState === 'idle') {
      // 권한 확인
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setShowPermissionModal(true);
        return;
      }

      try {
        // 음성 녹음 시작
        setVoiceState('listening');
        setRemainingTime(5); // 초기화
        const result = await audioRecorderPlayer.startRecorder();
        console.log('✅ 녹음 시작:', result);

        // 카운트다운 타이머 시작 (1초마다)
        countdownTimer.current = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1) {
              clearInterval(countdownTimer.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // 5초 후 자동 종료
        autoStopTimer.current = setTimeout(() => {
          console.log('⏰ 5초 경과 - 자동 종료');
          if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
          }
          stopRecording();
        }, 5000);
      } catch (error) {
        console.error('❌ 녹음 시작 실패:', error);
        Alert.alert('오류', '녹음을 시작할 수 없습니다.');
        setVoiceState('idle');
      }
    } else if (voiceState === 'listening') {
      // 수동 녹음 중지 (버튼 다시 클릭)
      console.log('👆 수동 녹음 중지');
      if (autoStopTimer.current) {
        clearTimeout(autoStopTimer.current);
        autoStopTimer.current = null;
      }
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
      await stopRecording();
    }
  };

  // 녹음 중지 및 백엔드 전송
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('녹음 완료:', result);
      setAudioFilePath(result);

      // 백엔드로 전송
      setVoiceState('processing');
      const response = await sendVoiceRecording(result);

      // 결과 표시
      setRecognizedText(response.text || '인식 실패');
      setVoiceState('recognized');
    } catch (error) {
      console.error('음성 인식 실패:', error);
      Alert.alert('오류', '음성 인식에 실패했습니다.');
      setVoiceState('idle');
    }
  };

  // 다시 입력 버튼
  const handleRetry = () => {
    setVoiceState('idle');
    setRecognizedText('');
    setAudioFilePath('');
  };

  // 다음 단계로 버튼
  const handleNext = () => {
    navigation.navigate('YoutubeShortsScreen', {
      recipeName: recognizedText,
    });
  };

  // 닫기 버튼
  const handleClose = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 그라데이션 배경 */}
      <LinearGradient
        colors={['#7371FC', '#8677D9', '#B99DD8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={155.21}
        style={styles.gradientBackground}>
        {/* 배경 움직이는 원들 */}
        <Animated.View style={[styles.overlay02, overlay02Style]} />
        <Animated.View style={[styles.overlay01, overlay01Style]} />

        {/* 헤더 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}>
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>음성 입력</Text>
        </View>

        <Text style={styles.headerSubtitle}>요리명을 말씀해주세요</Text>

        {/* 메인 컨텐츠 */}
        <View style={styles.contentContainer}>
          {/* 마이크 버튼 */}
          <TouchableOpacity
            onPress={handleMicPress}
            disabled={voiceState === 'processing'}
            activeOpacity={0.8}>
            <Animated.View
              style={[styles.micButtonContainer, micAnimatedStyle]}>
              <LinearGradient
                colors={['#7371FC', '#8677D9', '#B99DD8']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                angle={167.96}
                style={styles.micButtonGradient}>
                <Image
                  source={require('../../assets/images/main/mainMice.png')}
                  style={styles.micImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* 상태별 텍스트 */}
          {voiceState === 'idle' && (
            <Text style={styles.instructionText}>버튼을 눌러 말하기</Text>
          )}
          {voiceState === 'listening' && (
            <>
              <Text style={styles.listeningText}>듣고 있어요...</Text>
              <Text style={styles.timerText}>{remainingTime}초</Text>
            </>
          )}
          {voiceState === 'processing' && (
            <Text style={styles.listeningText}>처리 중...</Text>
          )}

          {/* 인식 결과 */}
          {voiceState === 'recognized' && (
            <>
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>인식된 요리명:</Text>
                <Text style={styles.resultText}>{recognizedText}</Text>
              </View>

              {/* 버튼 2개 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
                  activeOpacity={0.7}>
                  <Text style={styles.retryButtonText}>다시 입력</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#3F3CFF', '#3D23D2', '#8D53CE']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    angle={174.99}
                    style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>다음 단계로</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </LinearGradient>

      {/* 권한 모달 */}
      <PermissionModal
        visible={showPermissionModal}
        title="음성 녹음 권한 필요"
        message="음성으로 레시피를 검색하기 위해 마이크 권한이 필요합니다. 설정에서 권한을 허용해주세요."
        onCancel={() => setShowPermissionModal(false)}
        onConfirm={() => setShowPermissionModal(false)}
      />
    </View>
  );
}
