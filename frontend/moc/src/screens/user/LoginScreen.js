import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Mail, Lock, Eye, EyeOff} from 'lucide-react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SocialButton from '../../components/common/SocialButton';
import {loginStyles} from '../../styles/screens/user/loginStyles';
import {colors} from '../../styles/common';
import authAPI, {signInWithGoogle, signInWithFacebook} from '../../api/auth';
import LoginLogo from '../../assets/images/user/loginLogo.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

/**
 * 로그인 화면
 * 온보딩 3단계 "시작하기" 버튼 클릭 후 진입
 */
export default function LoginScreen({navigation}) {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 로그인 버튼 활성화 조건
  const isLoginButtonDisabled = () => {
    return !email || !password || !validateEmail(email) || password.length < 6;
  };

  // 일반 로그인 처리
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // 이메일 유효성 검사
      if (!validateEmail(email)) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      // 비밀번호 길이 검사
      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }

      // Login API 호출
      const data = await authAPI.login(email, password);

      // 로그인 성공
      console.log('로그인 성공:', data);

      // 메인 앱으로 이동 (스택 초기화)
      navigation.reset({
        index: 0,
        routes: [{name: 'MainApp'}],
      });
      // 251213 추가: 로그인 후 푸시 알림 권한 요청 화면으로 이동
    } catch (err) {
      console.log('LOGIN ERROR DEBUG', {
        name: err?.name,
        message: err?.message,
        hasResponse: !!err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      console.error('로그인 실패:', err);

      const msg = err.response?.data?.message;
      if (msg) {
        setError(msg);
        return;
      }

      // 에러 메시지 설정
      if (err.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.response?.status === 404) {
        setError('등록되지 않은 이메일입니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. 구글 SDK로 idToken 획득
      const {idToken} = await signInWithGoogle();

      // 2. 백엔드로 idToken 전송
      const response = await authAPI.googleLogin(idToken);

      // 3. 메인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{name: 'MainApp'}],
      });
    } catch (err) {
      console.error('구글 로그인 실패:', err);
      setError(
        err.message === 'Sign in action cancelled'
          ? '로그인이 취소되었습니다.'
          : '구글 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이스북 로그인 처리
  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. 페이스북 SDK로 accessToken 획득
      const {accessToken} = await signInWithFacebook();

      // 2. 백엔드로 accessToken 전송
      const response = await authAPI.facebookLogin(accessToken);

      // 3. 메인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{name: 'MainApp'}],
      });
    } catch (err) {
      console.error('페이스북 로그인 실패:', err);
      setError(
        err.message === '사용자가 로그인을 취소했습니다.'
          ? '로그인이 취소되었습니다.'
          : '페이스북 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  // 계정 찾기 이동
  const handleForgotPassword = () => {
    navigation.navigate('FindAccount');
  };

  // 회원가입 이동
  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={loginStyles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={100}>
      <ScrollView
        contentContainerStyle={loginStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={loginStyles.content}>
          {/* 상단 일러스트 */}
          <View style={loginStyles.illustrationContainer}>
            <LoginLogo width={275} height={262} />
          </View>

          {/* 타이틀 */}
          <View style={loginStyles.titleContainer}>
            <Text style={loginStyles.title}>로그인</Text>
          </View>

          {/* 에러 메시지 */}
          {error ? (
            <View style={loginStyles.errorContainer}>
              <Text style={loginStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* 이메일 입력 */}
          <View style={loginStyles.inputContainer}>
            <Input
              placeholder="이메일을 입력해주세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon={<Mail size={24} color={colors.textLight} />}
              autoCapitalize="none"
            />
          </View>

          {/* 비밀번호 입력 */}
          <View style={loginStyles.inputContainer}>
            <Input
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Lock size={24} color={colors.textLight} />}
              rightIcon={
                showPassword ? (
                  <Eye size={24} color={colors.textLight} />
                ) : (
                  <EyeOff size={24} color={colors.textLight} />
                )
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          </View>

          {/* 계정 찾기 링크 */}
          <TouchableOpacity
            style={loginStyles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            activeOpacity={0.7}>
            <Text style={loginStyles.forgotPasswordText}>
              계정을 잃어버리셨나요?
            </Text>
          </TouchableOpacity>

          {/* 로그인 버튼 */}
          <View style={loginStyles.loginButtonContainer}>
            <Button
              title="로그인"
              variant="gradient"
              onPress={handleLogin}
              disabled={isLoginButtonDisabled()}
              loading={loading}
            />
          </View>

          {/* 구분선 */}
          <View style={loginStyles.divider} />

          {/* 소셜 로그인 */}
          <View style={loginStyles.socialLoginContainer}>
            <SocialButton
              provider="google"
              onPress={handleGoogleLogin}
              disabled={loading}
            />
            <SocialButton
              provider="facebook"
              onPress={handleFacebookLogin}
              disabled={loading}
            />
          </View>

          {/* 회원가입 링크 */}
          <View style={loginStyles.signupContainer}>
            <Text style={loginStyles.signupText}>회원가입이 필요하신가요?</Text>
            <TouchableOpacity onPress={handleSignup} activeOpacity={0.7}>
              <Text style={loginStyles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 로딩 오버레이 */}
      {loading && (
        <View style={loginStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.textWhite} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
