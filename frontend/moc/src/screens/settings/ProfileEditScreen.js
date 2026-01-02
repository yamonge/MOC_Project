import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, User, Camera, Mail} from 'lucide-react-native';
import styles from '../../styles/screens/settings/ProfileEditStyles';
import {colors} from '../../styles/common';
import {getUserInfo, updateProfile} from '../../api/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionModal from '../../components/common/PermissionModal';

/**
 * 프로필 수정 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "프로필 수정" 타이틀
 * - 프로필 사진 영역: 원형 아바타 + 카메라 버튼
 * - 입력 폼: 이름, 닉네임, 이메일(읽기전용)
 * - 하단 저장 버튼: 그라데이션 버튼
 */
export default function ProfileEditScreen({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    nickname: '',
    email: '',
    profileImage: null,
  });

  // 갤러리에서 돌아온 직후 서버 reload를 건너뛰기 위한 ref
  const skipLoadRef = useRef(false);

  useEffect(() => {
    // 마운트/포커스 시: Gallery에서 selectedImage와 함께 진입한 경우
    // 서버 데이터를 바로 덮어쓰지 않도록 처리
    const applyTempSelectedImage = async () => {
      try {
        // 우선 route params 확인
        if (route.params?.selectedImage) {
          console.log(
            'ProfileEditScreen -> mount received route.params.selectedImage:',
            route.params.selectedImage,
          );
          setProfileData(prev => ({
            ...prev,
            profileImage: route.params.selectedImage,
          }));
          skipLoadRef.current = true;
          navigation.setParams({selectedImage: undefined});
          return true;
        }

        // route params가 없으면 AsyncStorage의 임시값 확인
        const tmp = await AsyncStorage.getItem('tempSelectedImage');
        if (tmp) {
          console.log(
            'ProfileEditScreen -> mount found tempSelectedImage:',
            tmp,
          );
          setProfileData(prev => ({...prev, profileImage: tmp}));
          skipLoadRef.current = true;
          await AsyncStorage.removeItem('tempSelectedImage');
          return true;
        }
        return false;
      } catch (e) {
        console.warn('ProfileEditScreen -> applyTempSelectedImage error', e);
        return false;
      }
    };

    (async () => {
      const applied = await applyTempSelectedImage();
      if (!applied) {
        loadProfileData();
      }
    })();

    // 화면 진입 시 데이터 다시 로드 (수정 취소 시 원래 데이터로 복원)
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('Focus event triggered');
      console.log('skipLoadRef before reset:', skipLoadRef.current);

      // 뒤로가기 후 돌아올 때 항상 최신 데이터 로드
      skipLoadRef.current = false;
      console.log('skipLoadRef after reset:', skipLoadRef.current);

      // 로컬에 선택된 이미지가 있으면 서버 데이터 덮어쓰기 방지
      const tmp = await AsyncStorage.getItem('tempSelectedImage');
      if (tmp) {
        console.log(
          'Focus found tempSelectedImage, skipping server load:',
          tmp,
        );
        setProfileData(prev => ({...prev, profileImage: tmp}));
        return;
      }

      loadProfileData();
    });

    // 화면 이탈 시 임시 이미지 데이터 삭제
    const unsubscribeBlur = navigation.addListener('blur', async () => {
      console.log('Blur event triggered, clearing tempSelectedImage');
      try {
        await AsyncStorage.removeItem('tempSelectedImage');
      } catch (e) {
        console.warn('Failed to clear tempSelectedImage on blur:', e);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    console.log(
      'ProfileEditScreen -> profileData.profileImage changed:',
      profileData.profileImage,
    );
  }, [profileData.profileImage]);

  // 프로필 데이터 로드
  // 갤러리에서 돌아온 직후 서버 reload를 건너뛰기 위한 ref
  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('Loading profile data from server...');
      const data = await getUserInfo();
      console.log('Loaded profile data:', data);
      setProfileData({
        name: data.name || '',
        nickname: data.nickname || '',
        email: data.email || '',
        profileImage: data.profileImage || null,
      });
    } catch (error) {
      console.error('프로필 데이터 로드 실패:', error);
      Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 선택 (권한 체크 후 갤러리로 이동)
  const handleSelectImage = async () => {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version;
      const permission =
        androidVersion >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      // 권한 요청 (시스템 권한 창 표시)
      const granted = await PermissionsAndroid.request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // 권한 허용 → 갤러리로 이동
        navigation.navigate('Gallery', {from: 'profile'});
      } else {
        // 권한 거부 → 모달 표시
        setShowPermissionModal(true);
      }
    } else {
      // iOS는 바로 이동
      navigation.navigate('Gallery', {from: 'profile'});
    }
  };

  // 프로필 저장
  const handleSaveProfile = async () => {
    // 유효성 검사
    if (!profileData.name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!profileData.nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // API 호출 - updateProfile이 로컬 URI를 FormData로 자동 변환 처리
      await updateProfile({
        name: profileData.name,
        nickname: profileData.nickname,
        profileImage: profileData.profileImage, // content:// URI 그대로 전달
      });

      Alert.alert('완료', '프로필이 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Settings'),
        },
      ]);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      Alert.alert('오류', '프로필 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.email) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
      </View>

      {/* 스크롤 영역 */}
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}>
        {/* 프로필 사진 영역 */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {profileData.profileImage ? (
              <Image
                source={{uri: profileData.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <LinearGradient
                colors={['#98D8FF', '#698FEE', '#D7FEFF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.profileImagePlaceholder}>
                <User size={40} color={colors.white} strokeWidth={2} />
              </LinearGradient>
            )}

            {/* 카메라 버튼 */}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleSelectImage}
              activeOpacity={0.8}>
              <Camera size={14} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileImageLabel}>프로필 사진 변경</Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.formContainer}>
          {/* 이름 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              placeholderTextColor="rgba(10, 10, 10, 0.5)"
              value={profileData.name}
              onChangeText={text =>
                setProfileData({...profileData, name: text})
              }
              autoCapitalize="none"
            />
          </View>

          {/* 닉네임 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="길동이"
              placeholderTextColor="rgba(10, 10, 10, 0.5)"
              value={profileData.nickname}
              onChangeText={text =>
                setProfileData({...profileData, nickname: text})
              }
              autoCapitalize="none"
            />
          </View>

          {/* 이메일 (읽기 전용) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>이메일</Text>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                value={profileData.email}
                editable={false}
                placeholderTextColor={colors.textGray}
              />
              <View style={styles.emailIcon}>
                <Mail size={16} color={colors.textGray} strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.emailHint}>이메일은 변경할 수 없습니다</Text>
          </View>
        </View>

        {/* 저장 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#00B8DB', '#155DFC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.saveButtonGradient}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>저장하기</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* 갤러리 권한 모달 */}
      <PermissionModal
        visible={showPermissionModal}
        title="갤러리 권한 필요"
        message={
          '프로필 사진 선택을 위해 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.'
        }
        onCancel={() => setShowPermissionModal(false)}
        onConfirm={() => setShowPermissionModal(false)}
      />
    </View>
  );
}
