import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FindIdPwdLogo from '../../assets/images/user/findIdPwdLogo.svg';
import {ChevronLeft, Key, Lock} from 'lucide-react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {resetPasswordStyles} from '../../styles/screens/user/resetPasswordStyles';
import {colors} from '../../styles/common';
import authAPI from '../../api/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loginStyles} from '../../styles/screens/user/loginStyles';

/**
 * 비밀번호 재설정 화면
 * 이메일에서 받은 토큰으로 새 비밀번호를 설정합니다
 */
export default function ResetPasswordScreen({navigation}) {
  // State
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = password => {
    return password.length >= 6;
  };

  // 비밀번호 재설정 처리
  const handleResetPassword = async () => {
    // 토큰 확인
    if (!token) {
      Alert.alert('알림', '토큰을 입력해주세요.');
      return;
    }

    // 새 비밀번호 확인
    if (!newPassword) {
      Alert.alert('알림', '새 비밀번호를 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
      Alert.alert('알림', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 비밀번호 확인 일치 검사
    if (newPassword !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      await authAPI.resetPasswordByToken({
        token: token.trim(),
        newPassword,
        newPasswordConfirm: confirmPassword,
      });

      Alert.alert(
        '성공',
        '비밀번호가 성공적으로 변경되었습니다.\n새 비밀번호로 로그인해주세요.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err) {
      console.error('비밀번호 재설정 실패:', err);

      if (err.response?.status === 400) {
        Alert.alert('오류', '유효하지 않거나 만료된 토큰입니다.');
      } else if (err.response?.status === 404) {
        Alert.alert('오류', '토큰을 찾을 수 없습니다.');
      } else {
        Alert.alert('오류', '비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={loginStyles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={100}>
      {/* 헤더 */}
      <View style={resetPasswordStyles.header}>
        <TouchableOpacity
          style={resetPasswordStyles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={resetPasswordStyles.headerTitle}>비밀번호 재설정</Text>
      </View>

      {/* 컨텐츠 */}
      <ScrollView
        contentContainerStyle={resetPasswordStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={resetPasswordStyles.content}>
          {/* 일러스트 */}
          <View style={resetPasswordStyles.illustrationContainer}>
            <FindIdPwdLogo width={147} height={147} />
          </View>

          {/* 제목 */}
          <View style={resetPasswordStyles.titleContainer}>
            <Text style={resetPasswordStyles.title}>비밀번호 재설정</Text>
            <Text style={resetPasswordStyles.description}>
              이메일로 받은 토큰과 새 비밀번호를 입력해주세요
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={resetPasswordStyles.inputSection}>
            {/* 토큰 */}
            <View style={resetPasswordStyles.inputGroup}>
              <Text style={resetPasswordStyles.inputLabel}>인증 토큰</Text>
              <Input
                placeholder="이메일에서 받은 토큰을 붙여넣기"
                value={token}
                onChangeText={setToken}
                leftIcon={<Key size={16} color={colors.textLight} />}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={2}
              />
            </View>

            {/* 새 비밀번호 */}
            <View style={resetPasswordStyles.inputGroup}>
              <Text style={resetPasswordStyles.inputLabel}>새 비밀번호</Text>
              <Input
                placeholder="새 비밀번호 (최소 6자)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                leftIcon={<Lock size={16} color={colors.textLight} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Text style={{color: colors.textLight, fontSize: 12}}>
                      {showNewPassword ? '숨기기' : '보기'}
                    </Text>
                  </TouchableOpacity>
                }
                autoCapitalize="none"
              />
            </View>

            {/* 비밀번호 확인 */}
            <View style={resetPasswordStyles.inputGroup}>
              <Text style={resetPasswordStyles.inputLabel}>비밀번호 확인</Text>
              <Input
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                leftIcon={<Lock size={16} color={colors.textLight} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <Text style={{color: colors.textLight, fontSize: 12}}>
                      {showConfirmPassword ? '숨기기' : '보기'}
                    </Text>
                  </TouchableOpacity>
                }
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* 버튼 */}
          <View style={resetPasswordStyles.submitButtonContainer}>
            <Button
              title="비밀번호 재설정"
              variant="gradient"
              onPress={handleResetPassword}
              disabled={!token || !newPassword || !confirmPassword || loading}
              loading={loading}
            />
          </View>

          {/* 안내 박스 */}
          <View style={resetPasswordStyles.infoBox}>
            <Text style={resetPasswordStyles.infoBoxTitle}>💡 안내사항</Text>
            <View style={resetPasswordStyles.infoBoxContent}>
              <Text style={resetPasswordStyles.infoBoxItem}>
                • 이메일에서 받은 토큰을 복사하여 붙여넣으세요
              </Text>
              <Text style={resetPasswordStyles.infoBoxItem}>
                • 비밀번호는 최소 6자 이상이어야 합니다
              </Text>
              <Text style={resetPasswordStyles.infoBoxItem}>
                • 토큰은 1시간 동안만 유효합니다
              </Text>
              <Text style={resetPasswordStyles.infoBoxItem}>
                • 재설정 후 새 비밀번호로 로그인해주세요
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 로딩 오버레이 */}
      {loading && (
        <View style={resetPasswordStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.textWhite} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
