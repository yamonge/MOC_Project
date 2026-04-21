import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuCard from '../../components/mypage/MenuCard';
import styles from '../../styles/screens/mypage/ProfileScreenStyles';
import {getMenuCounts} from '../../api/mypage';
import {getUserInfo} from '../../api/settings';

/**
 * 마이페이지 메인 화면
 *
 * 구조:
 * - 상단: 프로필 영역 (사진, 닉네임, 이메일, 로그아웃)
 * - 하단: 6개 메뉴 카드 그리드 (2x3)
 */
export default function ProfileScreen({navigation}) {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    profileImage: null,
  });

  const [menuCounts, setMenuCounts] = useState({
    ingredients: 0,
    savedRecipes: 0,
    sharedRecipes: 0,
    reviews: 0,
    reports: 0,
  });
  // ✅ 화면 최초 로드 시 사용자 정보 로딩
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
    }, []),
  );

  // ✅ 화면이 다시 보일 때(포커스될 때)마다 최신 값 재로딩
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadMenuCounts();
      }
    }, [userId]),
  );

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const userIdNum = storedUserId ? Number(storedUserId) : null;
      setUserId(userIdNum);

      if (userIdNum) {
        // API에서 최신 프로필 정보 가져오기
        const userData = await getUserInfo();
        setUserInfo({
          nickname: userData.nickname || '사용자',
          email: userData.email || '',
          profileImage: userData.profileImage || null,
        });

        // AsyncStorage에도 최신 정보 저장 (다른 화면에서 사용할 수 있도록)
        if (userData.nickname) {
          await AsyncStorage.setItem('userNickname', userData.nickname);
        }
        if (userData.email) {
          await AsyncStorage.setItem('userEmail', userData.email);
        }
        if (userData.profileImage) {
          await AsyncStorage.setItem('profileImage', userData.profileImage);
        } else {
          await AsyncStorage.removeItem('profileImage');
        }
      } else {
        // userId가 없으면 AsyncStorage에서 기본값 가져오기
        const nickname = await AsyncStorage.getItem('userNickname');
        const email = await AsyncStorage.getItem('userEmail');
        const profileImage = await AsyncStorage.getItem('profileImage');
        setUserInfo({
          nickname: nickname || '사용자',
          email: email || '',
          profileImage: profileImage,
        });
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      // 에러 발생 시 AsyncStorage에서 기본값 가져오기
      try {
        const nickname = await AsyncStorage.getItem('userNickname');
        const email = await AsyncStorage.getItem('userEmail');
        const profileImage = await AsyncStorage.getItem('profileImage');
        setUserInfo({
          nickname: nickname || '사용자',
          email: email || '',
          profileImage: profileImage,
        });
      } catch (storageError) {
        console.error('AsyncStorage 읽기 실패:', storageError);
      }
    }
  };

  // 메뉴 카운트 로드
  const loadMenuCounts = async () => {
    try {
      const data = await getMenuCounts(userId);
      console.log('📦 menuCounts response:', data);
      setMenuCounts({
        ingredients: data.ingredientCount,
        savedRecipes: data.savedRecipeCount,
        sharedRecipes: data.sharedRecipeCount,
        reviews: data.receivedReviewCount,
        reports: data.reportCount,
      });
    } catch (error) {
      console.error('메뉴 카운트 로드 실패:', error);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              'accessToken',
              'refreshToken',
              'userId',
              'userEmail',
              'userName',
              'userNickname',
              'userType',
              'userStatus',
              'profileImage',
            ]);
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (error) {
            console.error('로그아웃 실패:', error);
            Alert.alert('오류', '로그아웃에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // 메뉴 카드 데이터
  const menuItems = [
    {
      id: 'ingredients',
      title: '재료 관리',
      count: menuCounts.ingredients,
      backgroundColor: 'rgba(94,119,174,0.25)',
      icon: 'clipboard',
      screen: 'IngredientManagement',
    },
    {
      id: 'savedRecipes',
      title: '저장된 게시글',
      count: menuCounts.savedRecipes,
      backgroundColor: 'rgba(127,201,231,0.25)',
      icon: 'star',
      screen: 'SavedRecipes',
    },
    {
      id: 'sharedRecipes',
      title: '공유한 게시글',
      count: menuCounts.sharedRecipes,
      backgroundColor: 'rgba(152,166,191,0.25)',
      icon: 'send',
      screen: 'SharedRecipes',
    },
    {
      id: 'reviews',
      title: '받은 후기 목록',
      count: menuCounts.reviews,
      backgroundColor: 'rgba(255,145,240,0.25)',
      icon: 'mail',
      screen: 'ReceivedReviews',
    },
    {
      id: 'reports',
      title: '신고 내역',
      count: menuCounts.reports,
      backgroundColor: '#f9e0e0',
      icon: 'alert-triangle',
      screen: 'ReportHistory',
    },
    {
      id: 'settings',
      title: '설정',
      count: '0', // 설정은 카운트 없음
      backgroundColor: '#e2e2e2',
      icon: 'settings',
      screen: 'Settings',
    },
  ];

  // 메뉴 카드 클릭 핸들러
  const handleMenuPress = item => {
    if (item.screen === 'IngredientManagement') {
      navigation.navigate('IngredientManagement');
    } else if (item.screen === 'ReceivedReviews') {
      navigation.navigate('ReceivedReviews', {userId});
    } else if (item.screen === 'SavedRecipes') {
      navigation.navigate('SavedRecipes');
    } else if (item.screen === 'SharedRecipes') {
      navigation.navigate('SharedRecipes');
    } else if (item.screen === 'ReportHistory') {
      navigation.navigate('ReportHistory');
    } else if (item.screen === 'Settings') {
      navigation.navigate('Settings');
    } else {
      // 개발 중인 화면 처리
      Alert.alert('개발 중', `${item.title} 화면은 개발 중입니다.`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 프로필 영역 */}
        <View style={styles.profileSection}>
          {/* 프로필 이미지 */}
          <View style={styles.profileImageContainer}>
            {userInfo.profileImage ? (
              <Image
                source={{uri: userInfo.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {userInfo.nickname.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          {/* 닉네임 */}
          <Text style={styles.nickname}>{userInfo.nickname}</Text>

          {/* 이메일 */}
          <Text style={styles.email}>{userInfo.email}</Text>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 메뉴 카드 그리드 */}
        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <View key={item.id} style={styles.menuCardWrapper}>
              <MenuCard
                title={item.title}
                count={item.count}
                backgroundColor={item.backgroundColor}
                icon={item.icon}
                onPress={() => handleMenuPress(item)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
