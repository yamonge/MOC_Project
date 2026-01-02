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
import SignupLogo from '../../assets/images/user/signupLogo.svg';
import {
  Mail,
  User,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from 'lucide-react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';
import DatePickerModal from '../../components/common/DatePickerModal';
import {signupStyles} from '../../styles/screens/user/signupStyles';
import {loginStyles} from '../../styles/screens/user/loginStyles';
import {colors} from '../../styles/common';
import authAPI from '../../api/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

/**
 * 회원가입 화면
 * 로그인 화면에서 "회원가입" 링크 클릭 시 진입
 */
export default function SignupScreen({navigation}) {
  // 입력 필드 State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 비밀번호 표시 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 중복 체크 상태
  const [emailChecked, setEmailChecked] = useState(false);

  // 약관 동의 State
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // 약관 펼치기/접기
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);

  // 생년월일 모달
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 로딩 및 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 중복 체크
  const handleCheckEmail = async () => {
    try {
      if (!email) {
        Alert.alert('알림', '이메일을 입력해주세요.');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
        return;
      }

      setLoading(true);
      const response = await authAPI.checkEmail(email);

      if (response.available) {
        setEmailChecked(true);
        Alert.alert('사용 가능', '사용 가능한 이메일입니다.');
      } else {
        setEmailChecked(false);
        Alert.alert('중복', '이미 사용 중인 이메일입니다.');
      }
    } catch (err) {
      console.error('이메일 중복 체크 실패:', err);
      Alert.alert('오류', '이메일 중복 체크 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 사용 가능 여부 체크 (회원가입 시점에만 사용)
  const checkNicknameAvailable = async () => {
    if (!nickname) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return false;
    }

    if (nickname.length < 2) {
      Alert.alert('알림', '닉네임은 2자 이상 입력해주세요.');
      return false;
    }

    try {
      const response = await authAPI.checkNickname(nickname); // { available: boolean }

      if (!response.available) {
        Alert.alert('중복', '이미 사용 중인 닉네임입니다.');
        return false;
      }

      return true;
    } catch (err) {
      console.error('닉네임 중복 체크 실패:', err);
      Alert.alert('오류', '닉네임 중복 체크 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 이메일 변경 시 중복 체크 상태 초기화
  const handleEmailChange = text => {
    setEmail(text);
    setEmailChecked(false);
  };

  // 닉네임 변경 시 중복 체크 상태 초기화
  const handleNicknameChange = text => {
    setNickname(text);
  };

  // 생년월일 선택
  const handleDateConfirm = date => {
    setBirthDate(date);
  };

  // 생년월일 포맷 (YYYY-MM-DD)
  const formatDate = date => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // 전체 동의 토글
  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
    setAgreeMarketing(newValue);
  };

  // 개별 약관 동의 시 전체 동의 상태 업데이트
  const handleIndividualAgree = (setter, value) => {
    setter(value);
    // 전체 동의 체크박스는 모두 체크되었을 때만 체크
    const allChecked =
      (setter === setAgreeTerms ? value : agreeTerms) &&
      (setter === setAgreePrivacy ? value : agreePrivacy) &&
      (setter === setAgreeMarketing ? value : agreeMarketing);
    setAgreeAll(allChecked);
  };

  // 회원가입 버튼 활성화 조건
  const isSignupButtonDisabled = () => {
    return (
      !email ||
      !emailChecked ||
      !name ||
      !nickname ||
      !birthDate ||
      !password ||
      !passwordConfirm ||
      password !== passwordConfirm ||
      password.length < 6 ||
      !agreeTerms ||
      !agreePrivacy
    );
  };

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError('');

      // 최종 유효성 검사
      if (!emailChecked) {
        setError('이메일 중복 확인을 해주세요.');
        return;
      }

      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!agreeTerms || !agreePrivacy) {
        setError('필수 약관에 동의해주세요.');
        return;
      }

      const nicknameOk = await checkNicknameAvailable();
      if (!nicknameOk) {
        // Alert는 checkNicknameAvailable 내부에서 이미 호출됨
        setError('이미 사용 중인 닉네임입니다.');
        return;
      }

      // 회원가입 API 호출
      const userData = {
        userEmail: email,
        userName: name,
        userNickname: nickname,
        userBirthDate: birthDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
        userPassword: password,
        passwordConfirm: passwordConfirm,
        agreeMarketing,
      };

      const response = await authAPI.signup(userData);

      // 회원가입 성공
      console.log('회원가입 성공:', response);
      Alert.alert(
        '회원가입 완료',
        '회원가입이 완료되었습니다. 로그인해주세요.',
        [
          {
            text: '확인',
            onPress: () => {
              navigation.replace('Login');
            },
          },
        ],
      );
    } catch (err) {
      console.error('회원가입 실패:', err);

      if (err.response?.status === 409) {
        setError('이미 가입된 이메일입니다.');
      } else if (err.response?.status === 400) {
        setError('입력 정보를 확인해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      <View style={signupStyles.header}>
        <TouchableOpacity
          style={signupStyles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={signupStyles.headerTitle}>회원가입</Text>
      </View>

      <ScrollView
        contentContainerStyle={signupStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={signupStyles.content}>
          {/* 상단 일러스트 */}
          <View style={signupStyles.illustrationContainer}>
            <SignupLogo width={275} height={262} />
          </View>

          {/* 타이틀 */}
          <View style={signupStyles.titleContainer}>
            <Text style={signupStyles.title}>회원가입</Text>
          </View>

          {/* 에러 메시지 */}
          {error ? (
            <View style={signupStyles.errorContainer}>
              <Text style={signupStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* 입력 필드 영역 */}
          <View style={signupStyles.inputSection}>
            {/* 이메일 + 중복확인 */}
            <View style={signupStyles.inputWithButtonContainer}>
              <View style={signupStyles.inputWithButton}>
                <Input
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  leftIcon={<Mail size={20} color={colors.textLight} />}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={[
                  signupStyles.checkButton,
                  emailChecked && signupStyles.checkButtonSuccess,
                ]}
                onPress={handleCheckEmail}>
                <Text style={signupStyles.checkButtonText}>
                  {emailChecked ? '확인완료' : '중복확인'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 이름 */}
            <View style={signupStyles.inputContainerInputName}>
              <Input
                placeholder="이름을 입력해주세요"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={20} color={colors.textLight} />}
              />
            </View>

            {/* 닉네임 (중복확인 없음 - 피그마에는 없지만 요청에 따라 추가) */}
            <View style={signupStyles.inputContainer}>
              <Input
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChangeText={handleNicknameChange}
                leftIcon={<User size={20} color={colors.textLight} />}
              />
            </View>

            {/* 생년월일 */}
            <View style={signupStyles.birthDateInputContainer}>
              <TouchableOpacity
                style={signupStyles.birthDateContainer}
                onPress={() => setShowDatePicker(true)}>
                <Calendar
                  size={20}
                  color={colors.textLight}
                  style={signupStyles.birthDateIcon}
                />
                <Text
                  style={
                    birthDate
                      ? signupStyles.birthDateText
                      : signupStyles.birthDatePlaceholder
                  }>
                  {birthDate
                    ? formatDate(birthDate)
                    : '생년월일을 선택해주세요'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 비밀번호 */}
            <View style={signupStyles.inputContainerInputPassword}>
              <Input
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color={colors.textLight} />}
                rightIcon={
                  showPassword ? (
                    <Eye size={20} color={colors.textLight} />
                  ) : (
                    <EyeOff size={20} color={colors.textLight} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {/* 비밀번호 확인 */}
            <View style={signupStyles.inputContainerInputPassword}>
              <Input
                placeholder="비밀번호를 다시 입력해주세요"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPasswordConfirm}
                leftIcon={<Lock size={20} color={colors.textLight} />}
                rightIcon={
                  showPasswordConfirm ? (
                    <Eye size={20} color={colors.textLight} />
                  ) : (
                    <EyeOff size={20} color={colors.textLight} />
                  )
                }
                onRightIconPress={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
                error={
                  passwordConfirm && password !== passwordConfirm
                    ? '비밀번호가 일치하지 않습니다.'
                    : ''
                }
              />
            </View>
          </View>

          {/* 약관 동의 영역 */}
          <View style={signupStyles.termsSection}>
            <Text style={signupStyles.termsSectionTitle}>약관 동의</Text>

            {/* 전체 동의 */}
            <View style={signupStyles.allAgreeContainer}>
              <Checkbox
                checked={agreeAll}
                onPress={handleAgreeAll}
                label="전체 동의"
                variant="gradient"
              />
            </View>

            {/* 이용약관 동의 (필수) - 펼치기/접기 */}
            <View style={signupStyles.termItemContainer}>
              <View style={signupStyles.termItemHeader}>
                <Checkbox
                  checked={agreeTerms}
                  onPress={() =>
                    handleIndividualAgree(setAgreeTerms, !agreeTerms)
                  }
                  labelComponent={
                    <View style={signupStyles.termItemLabel}>
                      <Text style={signupStyles.termItemText}>
                        이용약관 동의
                      </Text>
                      <Text
                        style={[
                          signupStyles.termItemBadge,
                          signupStyles.requiredBadge,
                        ]}>
                        (필수)
                      </Text>
                    </View>
                  }
                />
                <TouchableOpacity
                  style={signupStyles.expandButton}
                  onPress={() => setTermsExpanded(!termsExpanded)}>
                  {termsExpanded ? (
                    <ChevronUp size={20} color={colors.textDark} />
                  ) : (
                    <ChevronDown size={20} color={colors.textDark} />
                  )}
                </TouchableOpacity>
              </View>

              {/* 약관 내용 */}
              {termsExpanded && (
                <View style={signupStyles.termContentContainer}>
                  <ScrollView
                    style={signupStyles.termContentScrollView}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}>
                    <Text style={signupStyles.termContentText}>
                      제1조 (목적){'\n'}본 약관은 서비스 이용에 관한 조건 및
                      절차, 기타 필요한 사항을 규정함을 목적으로 합니다.{'\n\n'}
                      제2조 (정의){'\n'}
                      "서비스"란 회원이 이용할 수 있는 모든 서비스를 의미합니다.
                      {'\n\n'}
                      제3조 (약관의 효력 및 변경){'\n'}본 약관은 서비스를
                      이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
                      {'\n\n'}
                      제4조 (회원가입){'\n'}서비스를 이용하기 위해서는 본 약관에
                      동의하고 회원가입 절차를 완료해야 합니다.{'\n\n'}
                      제5조 (서비스 이용){'\n'}회원은 본 서비스를 이용하여
                      다양한 기능을 사용할 수 있습니다.
                    </Text>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* 개인정보 처리방침 동의 (필수) */}
            <View style={signupStyles.termItemContainer}>
              <View style={signupStyles.termItemHeader}>
                <Checkbox
                  checked={agreePrivacy}
                  onPress={() =>
                    handleIndividualAgree(setAgreePrivacy, !agreePrivacy)
                  }
                  labelComponent={
                    <View style={signupStyles.termItemLabel}>
                      <Text style={signupStyles.termItemText}>
                        개인정보 처리방침 동의
                      </Text>
                      <Text
                        style={[
                          signupStyles.termItemBadge,
                          signupStyles.requiredBadge,
                        ]}>
                        (필수)
                      </Text>
                    </View>
                  }
                />
                <TouchableOpacity
                  style={signupStyles.expandButton}
                  onPress={() => setPrivacyExpanded(!privacyExpanded)}>
                  {privacyExpanded ? (
                    <ChevronUp size={20} color={colors.textDark} />
                  ) : (
                    <ChevronDown size={20} color={colors.textDark} />
                  )}
                </TouchableOpacity>
              </View>

              {/* 개인정보 처리방침 내용 */}
              {privacyExpanded && (
                <View style={signupStyles.termContentContainer}>
                  <ScrollView
                    style={signupStyles.termContentScrollView}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}>
                    <Text style={signupStyles.termContentText}>
                      제1조 (개인정보의 수집 및 이용 목적){'\n'}회사는 다음의
                      목적을 위해 개인정보를 수집 및 이용합니다.{'\n\n'}
                      1. 회원 가입 및 관리{'\n'}
                      2. 서비스 제공{'\n'}
                      3. 고객 문의 처리{'\n\n'}
                      제2조 (수집하는 개인정보 항목){'\n'}- 이메일, 이름,
                      닉네임, 생년월일{'\n\n'}
                      제3조 (개인정보의 보유 및 이용기간){'\n'}
                      회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간
                      보관합니다.
                    </Text>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* 마케팅 정보 수신 동의 (선택) */}
            <View style={signupStyles.termItemContainer}>
              <View style={signupStyles.termItemHeader}>
                <Checkbox
                  checked={agreeMarketing}
                  onPress={() =>
                    handleIndividualAgree(setAgreeMarketing, !agreeMarketing)
                  }
                  labelComponent={
                    <View style={signupStyles.termItemLabel}>
                      <Text style={signupStyles.termItemText}>
                        마케팅 정보 수신 동의
                      </Text>
                      <Text
                        style={[
                          signupStyles.termItemBadge,
                          signupStyles.optionalBadge,
                        ]}>
                        (선택)
                      </Text>
                    </View>
                  }
                />
              </View>
            </View>
          </View>

          {/* 회원가입 버튼 */}
          <View style={signupStyles.signupButtonContainer}>
            <Button
              title="회원가입"
              variant="gradient"
              onPress={handleSignup}
              disabled={isSignupButtonDisabled()}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>

      {/* 생년월일 선택 모달 */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        initialDate={birthDate}
      />

      {/* 로딩 오버레이 */}
      {loading && (
        <View style={signupStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.textWhite} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
