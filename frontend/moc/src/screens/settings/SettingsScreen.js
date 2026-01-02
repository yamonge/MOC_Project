import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  User,
  Lock,
  Bell,
  Shield,
  FileText,
  Info,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Star,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import styles from '../../styles/screens/settings/SettingsStyles';
import {colors} from '../../styles/common/index';
import {getUserInfo, withdrawUser, checkAdminStatus} from '../../api/settings';

/**
 * 설정 메인 화면
 *
 * 구조:
 * - 상단: 헤더 (그라데이션 배경, 뒤로가기, "설정" 타이틀)
 * - 중단: 설정 메뉴 섹션들
 *   - 계정: 프로필 수정, 비밀번호 변경
 *   - 알림: 알림 설정
 *   - 권한 설정: 카메라 권한, 마이크 권한
 *   - 관리자 전용: 관리자 설정 (조건부)
 *   - 정보: 개인정보 처리방침, 앱 정보
 * - 하단: 회원탈퇴 버튼, 버전 정보
 */
export default function SettingsScreen({navigation}) {
  const [userInfo, setUserInfo] = useState({nickname: '', email: ''});
  const [isAdmin, setIsAdmin] = useState(false);
  const [appVersion] = useState('1.0.0');

  useEffect(() => {
    loadUserInfo();
    loadUserRole(); // ✅ 최초 1회

    const unsubscribe = navigation.addListener('focus', () => {
      loadUserInfo();
      loadUserRole(); // ✅ 돌아올 때마다 즉시 반영
    });

    return unsubscribe;
  }, [navigation]);

  // AsyncStorage에서 사용자 역할 로드 (즉시 판별: userType 우선)
  const loadUserRole = async () => {
    const userType = await AsyncStorage.getItem('userType'); // 'Y' | 'N'
    if (userType) {
      setIsAdmin(userType === 'Y');
      return;
    }

    // fallback: 기존 userRole
    const role = await AsyncStorage.getItem('userRole'); // 'admin' | 'user' | null
    setIsAdmin(role === 'admin');
  };

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    try {
      const data = await getUserInfo();
      setUserInfo({
        nickname: data.nickname,
        email: data.email,
      });
      // 역할 정보도 함께 확인
      // ✅ 중요: admin이 아니면 false로도 세팅
      const role = data?.role; // 'admin' | 'user' (백엔드 스펙에 맞게)
      setIsAdmin(role === 'admin');

      // (권장) role 저장 유지
      if (role) {
        await AsyncStorage.setItem('userRole', role);
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  // 회원탈퇴 처리
  const handleWithdraw = () => {
    Alert.alert(
      '회원탈퇴',
      '정말로 탈퇴하시겠습니까?\n탈퇴 후 모든 데이터가 삭제됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              // API 호출하여 회원탈퇴 처리
              await withdrawUser();

              // 로그인 화면으로 이동
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (error) {
              console.error('회원탈퇴 실패:', error);
              Alert.alert('오류', '회원탈퇴에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  // 설정 메뉴 항목 렌더링
  const SettingMenuItem = ({
    icon: Icon,
    label,
    onPress,
    iconColor,
    isAdmin = false,
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, isAdmin && styles.menuItemAdmin]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View
        style={[
          styles.iconContainer,
          isAdmin && styles.iconContainerAdmin,
          {backgroundColor: iconColor},
        ]}>
        <Icon size={24} color={colors.white} strokeWidth={2} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={20} color="#99a1af" strokeWidth={2} />
    </TouchableOpacity>
  );

  // 섹션 제목 렌더링
  const SectionTitle = ({title}) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <LinearGradient
        colors={['#C4C4C4', '#363535']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.8365]}
        style={styles.header}>
        {/* 배경 장식 아이콘들 */}
        <View style={[styles.decorIcon, styles.decorIcon1]}>
          <SettingsIcon
            size={48}
            color="rgba(255, 255, 255, 0.3)"
            strokeWidth={2}
          />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon2]}>
          <Shield size={28} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon3]}>
          <Star size={42} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Profile')}>
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <Image
          source={require('../../assets/images/mypage/settings.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 계정 섹션 */}
        <SectionTitle title="계정" />
        <SettingMenuItem
          icon={User}
          label="프로필 수정"
          iconColor="#2b7fff"
          onPress={() => navigation.navigate('ProfileEdit')}
        />
        <SettingMenuItem
          icon={Lock}
          label="비밀번호 변경"
          iconColor="#ad46ff"
          onPress={() => navigation.navigate('PasswordChange')}
        />

        {/* 알림 섹션 */}
        <SectionTitle title="알림" />
        <SettingMenuItem
          icon={Bell}
          label="알림 설정"
          iconColor="#ff6900"
          onPress={() => navigation.navigate('NotificationSettings')}
        />

        {/* 관리자 전용 섹션 */}
        {isAdmin && (
          <>
            <SectionTitle title="관리자 전용" />
            <SettingMenuItem
              icon={Shield}
              label="관리자 설정"
              iconColor="#fb2c36"
              onPress={() => navigation.navigate('AdminSettings')}
              isAdmin={true}
            />
          </>
        )}

        {/* 정보 섹션 */}
        <SectionTitle title="정보" />
        <SettingMenuItem
          icon={FileText}
          label="개인정보 처리방침"
          iconColor="#fb2c36"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <SettingMenuItem
          icon={Info}
          label="앱 정보"
          iconColor="#6a7282"
          onPress={() => navigation.navigate('AppInfo')}
        />

        {/* 회원탈퇴 버튼 */}
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdraw}
          activeOpacity={0.7}>
          <LogOut size={20} color={colors.white} strokeWidth={2} />
          <Text style={styles.withdrawButtonText}>회원탈퇴</Text>
        </TouchableOpacity>

        {/* 버전 정보 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>버전 {appVersion}</Text>
          <Text style={styles.copyrightText}>© 2024 MOC 앱</Text>
        </View>
      </ScrollView>
    </View>
  );
}
