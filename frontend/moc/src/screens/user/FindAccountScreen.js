import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FindIdPwdLogo from '../../assets/images/user/findIdPwdLogo.svg';
import {ChevronLeft, User, Calendar, Mail} from 'lucide-react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DatePickerModal from '../../components/common/DatePickerModal';
import {findAccountStyles} from '../../styles/screens/user/findAccountStyles';
import {colors} from '../../styles/common';
import authAPI from '../../api/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loginStyles} from '../../styles/screens/user/loginStyles';

/**
 * 계정 찾기 화면 (이메일 찾기 + 비밀번호 찾기)
 * 로그인 화면에서 "계정을 잃어버리셨나요?" 클릭 시 진입
 */
export default function FindAccountScreen({navigation}) {
  // 탭 상태 (0: 이메일 찾기, 1: 비밀번호 찾기)
  const [activeTab, setActiveTab] = useState(0);

  // 이메일 찾기 입력 필드
  const [idName, setIdName] = useState('');
  const [idBirthDate, setIdBirthDate] = useState(null);

  // 비밀번호 찾기 입력 필드
  const [pwEmail, setPwEmail] = useState('');
  const [pwName, setPwName] = useState('');
  const [pwBirthDate, setPwBirthDate] = useState(null);

  // 생년월일 모달
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState('id'); // 'id' or 'pw'

  // 결과 상태
  const [findIdResult, setFindIdResult] = useState(null); // { maskedEmail, registeredDate }
  const [passwordSent, setPasswordSent] = useState(false);

  // 로딩
  const [loading, setLoading] = useState(false);

  // 생년월일 포맷 (YYYY년 MM월 DD일)
  const formatDate = date => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // 생년월일 API 포맷 (YYYY-MM-DD)
  const formatDateForAPI = date => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // 생년월일 선택 모달 열기
  const openDatePicker = type => {
    setDatePickerFor(type);
    setShowDatePicker(true);
  };

  // 생년월일 선택 완료
  const handleDateConfirm = date => {
    if (datePickerFor === 'id') {
      setIdBirthDate(date);
    } else {
      setPwBirthDate(date);
    }
  };

  // 탭 변경 시 결과 초기화
  const handleTabChange = tab => {
    setActiveTab(tab);
    setFindIdResult(null);
    setPasswordSent(false);
  };

  // 이메일 찾기 처리
  const handleFindEmail = async () => {
    if (!idName) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!idBirthDate) {
      Alert.alert('알림', '생년월일을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);

      const timestamp = idBirthDate.toISOString().split('.')[0];

      // findEmail API 호출
      const response = await authAPI.findEmail(idName, idBirthDate);
      setFindIdResult(response);
    } catch (err) {
      console.error('이메일 찾기 실패:', err);

      if (err.response?.status === 404) {
        Alert.alert('알림', '일치하는 사용자 정보를 찾을 수 없습니다.');
      } else {
        Alert.alert('오류', '이메일 찾기 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false); // 성공 실패 상관없이 호출
    }
  };

  // 로그인 화면으로 이동
  const goToLogin = () => {
    navigation.replace('Login');
  };

  // 임시 비밀번호 발송 처리
  const handleSendPassword = async () => {
    if (!pwEmail) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    if (!pwName) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!pwBirthDate) {
      Alert.alert('알림', '생년월일을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.sendPasswordResetLink(
        pwEmail,
        pwName,
        pwBirthDate,
      );

      Alert.alert(
        '발송 완료',
        '이메일로 인증 토큰이 발송되었습니다.\n토큰을 복사하여 입력해주세요.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('ResetPassword'),
          },
        ],
      );
    } catch (err) {
      console.error('비밀번호 변경용 링크 - 이메일 발송 실패:', err);

      if (err.response?.status === 404) {
        Alert.alert('알림', '일치하는 사용자 정보를 찾을 수 없습니다.');
      } else {
        Alert.alert(
          '오류',
          '비밀번호 변경용 링크 발송 중 오류가 발생했습니다.',
        );
      }
    } finally {
      setLoading(false); // 성공 실패 상관없이 호출
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
      <View style={findAccountStyles.header}>
        <TouchableOpacity
          style={findAccountStyles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={findAccountStyles.headerTitle}>이메일·비밀번호 찾기</Text>
      </View>

      {/* 탭 */}
      <View style={findAccountStyles.tabContainer}>
        <TouchableOpacity
          style={[
            findAccountStyles.tab,
            activeTab === 0 && findAccountStyles.activeTab,
          ]}
          onPress={() => handleTabChange(0)}>
          <Text
            style={[
              findAccountStyles.tabText,
              activeTab === 0 && findAccountStyles.activeTabText,
            ]}>
            이메일 찾기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            findAccountStyles.tab,
            activeTab === 1 && findAccountStyles.activeTab,
          ]}
          onPress={() => handleTabChange(1)}>
          <Text
            style={[
              findAccountStyles.tabText,
              activeTab === 1 && findAccountStyles.activeTabText,
            ]}>
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <ScrollView
        contentContainerStyle={findAccountStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={findAccountStyles.content}>
          {/* 일러스트 */}
          <View style={findAccountStyles.illustrationContainer}>
            <FindIdPwdLogo width={147} height={147} />
          </View>

          {activeTab === 0 ? (
            /* ========== 이메일 찾기 ========== */
            <>
              <View style={findAccountStyles.titleContainer}>
                <Text style={findAccountStyles.title}>이메일 찾기</Text>
                <Text style={findAccountStyles.description}>
                  가입 시 입력한 정보를 입력해주세요
                </Text>
              </View>

              {/* 결과 박스 (성공 시) */}
              {findIdResult && (
                <View style={findAccountStyles.resultBox}>
                  <Text style={findAccountStyles.resultTitle}>
                    회원님의 이메일은
                  </Text>
                  <Text style={findAccountStyles.resultId}>
                    {findIdResult.userEmail}
                  </Text>
                  <View style={findAccountStyles.resultButtonContainer}>
                    <Button
                      title="로그인하러 가기"
                      variant="gradient"
                      onPress={goToLogin}
                    />
                  </View>
                </View>
              )}

              {/* 입력 폼 */}
              {!findIdResult && (
                <>
                  <View style={findAccountStyles.inputSection}>
                    {/* 이름 */}
                    <View style={findAccountStyles.inputGroup}>
                      <Text style={findAccountStyles.inputLabel}>이름</Text>
                      <Input
                        placeholder="이름을 입력하세요"
                        value={idName}
                        onChangeText={setIdName}
                        leftIcon={<User size={16} color={colors.textLight} />}
                      />
                    </View>

                    {/* 생년월일 */}
                    <View style={findAccountStyles.inputGroup}>
                      <Text style={findAccountStyles.inputLabel}>생년월일</Text>
                      <TouchableOpacity onPress={() => openDatePicker('id')}>
                        <Input
                          placeholder="생년월일을 선택하세요"
                          value={idBirthDate ? formatDate(idBirthDate) : ''}
                          editable={false}
                          leftIcon={
                            <Calendar size={16} color={colors.textLight} />
                          }
                          pointerEvents="none"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 버튼 */}
                  <View style={findAccountStyles.submitButtonContainer}>
                    <Button
                      title="이메일 찾기"
                      variant="gradient"
                      onPress={handleFindEmail}
                      disabled={!idName || !idBirthDate}
                      loading={loading}
                    />
                  </View>

                  {/* 안내 박스 */}
                  <View style={findAccountStyles.infoBox}>
                    <Text style={findAccountStyles.infoBoxTitle}>
                      가입 시 입력한 이름과 생년월일을 정확히 입력해주세요
                    </Text>
                  </View>
                </>
              )}
            </>
          ) : (
            /* ========== 비밀번호 찾기 ========== */
            <>
              <View style={findAccountStyles.titleContainer}>
                <Text style={findAccountStyles.title}>비밀번호 찾기</Text>
                <Text style={findAccountStyles.description}>
                  비밀번호 변경용 링크를 이메일로 발송해드립니다
                </Text>
              </View>

              {/* 입력 폼 */}
              <View style={findAccountStyles.inputSection}>
                {/* 이메일 */}
                <View style={findAccountStyles.inputGroup}>
                  <Text style={findAccountStyles.inputLabel}>이메일</Text>
                  <Input
                    placeholder="이메일을 입력하세요"
                    value={pwEmail}
                    onChangeText={setPwEmail}
                    keyboardType="email-address"
                    leftIcon={<Mail size={16} color={colors.textLight} />}
                    autoCapitalize="none"
                  />
                </View>

                {/* 이름 */}
                <View style={findAccountStyles.inputGroup}>
                  <Text style={findAccountStyles.inputLabel}>이름</Text>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={pwName}
                    onChangeText={setPwName}
                    leftIcon={<User size={16} color={colors.textLight} />}
                  />
                </View>

                {/* 생년월일 */}
                <View style={findAccountStyles.inputGroup}>
                  <Text style={findAccountStyles.inputLabel}>생년월일</Text>
                  <TouchableOpacity onPress={() => openDatePicker('pw')}>
                    <Input
                      placeholder="생년월일을 선택하세요"
                      value={pwBirthDate ? formatDate(pwBirthDate) : ''}
                      editable={false}
                      leftIcon={<Calendar size={16} color={colors.textLight} />}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 버튼 */}
              <View style={findAccountStyles.submitButtonContainer}>
                <Button
                  title="비밀번호 번경용 링크 발송"
                  variant="gradient"
                  onPress={handleSendPassword}
                  disabled={!pwEmail || !pwName || !pwBirthDate}
                  loading={loading}
                />
              </View>

              {/* 안내 박스 */}
              <View style={findAccountStyles.infoBox}>
                <Text style={findAccountStyles.infoBoxTitle}>💡 안내사항</Text>
                <View style={findAccountStyles.infoBoxContent}>
                  <Text style={findAccountStyles.infoBoxItem}>
                    • 가입 시 사용한 이메일을 입력해주세요
                  </Text>
                  <Text style={findAccountStyles.infoBoxItem}>
                    • 이메일로 비밀번호 변경 링크가 발송됩니다
                  </Text>
                  <Text style={findAccountStyles.infoBoxItem}>
                    • 링크를 통해 바로 비밀번호를 변경할 수 있습니다
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* 생년월일 선택 모달 */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        initialDate={datePickerFor === 'id' ? idBirthDate : pwBirthDate}
      />

      {/* 로딩 오버레이 */}
      {loading && (
        <View style={findAccountStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.textWhite} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
