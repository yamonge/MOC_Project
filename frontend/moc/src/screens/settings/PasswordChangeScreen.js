import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Lock, Eye, EyeOff} from 'lucide-react-native';
import styles from '../../styles/screens/settings/PasswordChangeStyles';
import {colors} from '../../styles/common';
import {changePassword} from '../../api/settings';

/**
 * 비밀번호 변경 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "비밀번호 변경" 타이틀
 * - 입력 폼: 현재 비밀번호, 새 비밀번호, 비밀번호 확인
 * - 안내 박스: 안전한 비밀번호 만들기 가이드
 * - 하단 변경 버튼: 그라데이션 버튼 (보라색)
 */
export default function PasswordChangeScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 화면 진입 시 입력값 초기화
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
    });

    return unsubscribe;
  }, [navigation]);

  // 비밀번호 유효성 검사
  const validatePassword = password => {
    // 8자 이상, 영문/숫자/특수문자 포함
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    // 유효성 검사
    if (!passwordData.currentPassword) {
      Alert.alert('알림', '현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!passwordData.newPassword) {
      Alert.alert('알림', '새 비밀번호를 입력해주세요.');
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      Alert.alert(
        '알림',
        '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.',
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('알림', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      Alert.alert('알림', '현재 비밀번호와 새 비밀번호가 같습니다.');
      return;
    }

    try {
      setLoading(true);

      // API 호출
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      Alert.alert('완료', '비밀번호가 변경되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Settings'),
        },
      ]);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      Alert.alert(
        '오류',
        '비밀번호 변경에 실패했습니다.\n현재 비밀번호를 확인해주세요.',
      );
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
      </View>

      {/* 스크롤 영역 */}
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}>
        {/* 입력 폼 */}
        <View style={styles.formContainer}>
          {/* 현재 비밀번호 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>현재 비밀번호</Text>
            <View style={styles.passwordInputContainer}>
              <Lock
                size={16}
                color={colors.textGray}
                strokeWidth={2}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="현재 비밀번호를 입력하세요"
                placeholderTextColor="rgba(10, 10, 10, 0.5)"
                value={passwordData.currentPassword}
                onChangeText={text =>
                  setPasswordData({...passwordData, currentPassword: text})
                }
                secureTextEntry={!showPassword.current}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }>
                {showPassword.current ? (
                  <Eye size={16} color={colors.textGray} strokeWidth={2} />
                ) : (
                  <EyeOff size={16} color={colors.textGray} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 새 비밀번호 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>새 비밀번호</Text>
            <View style={styles.passwordInputContainer}>
              <Lock
                size={16}
                color={colors.textGray}
                strokeWidth={2}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="새 비밀번호를 입력하세요"
                placeholderTextColor="rgba(10, 10, 10, 0.5)"
                value={passwordData.newPassword}
                onChangeText={text =>
                  setPasswordData({...passwordData, newPassword: text})
                }
                secureTextEntry={!showPassword.new}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword({...showPassword, new: !showPassword.new})
                }>
                {showPassword.new ? (
                  <Eye size={16} color={colors.textGray} strokeWidth={2} />
                ) : (
                  <EyeOff size={16} color={colors.textGray} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>
              8자 이상, 영문/숫자/특수문자 포함
            </Text>
          </View>

          {/* 비밀번호 확인 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>비밀번호 확인</Text>
            <View style={styles.passwordInputContainer}>
              <Lock
                size={16}
                color={colors.textGray}
                strokeWidth={2}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 다시 입력하세요"
                placeholderTextColor="rgba(10, 10, 10, 0.5)"
                value={passwordData.confirmPassword}
                onChangeText={text =>
                  setPasswordData({...passwordData, confirmPassword: text})
                }
                secureTextEntry={!showPassword.confirm}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }>
                {showPassword.confirm ? (
                  <Eye size={16} color={colors.textGray} strokeWidth={2} />
                ) : (
                  <EyeOff size={16} color={colors.textGray} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 안내 박스 */}
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>💡 안전한 비밀번호 만들기</Text>
          <View style={styles.guideList}>
            <Text style={styles.guideItem}>• 8자 이상의 길이로 설정하세요</Text>
            <Text style={styles.guideItem}>
              • 영문, 숫자, 특수문자를 조합하세요
            </Text>
            <Text style={styles.guideItem}>
              • 개인정보와 관련된 단어는 피하세요
            </Text>
            <Text style={styles.guideItem}>
              • 정기적으로 비밀번호를 변경하세요
            </Text>
          </View>
        </View>

        {/* 변경 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#AD46FF', '#7F22FE']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.changeButtonGradient}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.changeButtonText}>비밀번호 변경</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
