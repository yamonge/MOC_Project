import React, {useState, useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PortalProvider} from '@gorhom/portal';
import messaging from '@react-native-firebase/messaging';
import MetaballNavigation from './src/navigation/MetaballNavigation';
import StompClient from './src/utils/StompClient';
import useChatStore from './src/stores/chatStore';
import {
  initNotification,
  displayFCMNotification,
  setupFCM,
} from './src/utils/notificationService';
import {initGoogleSignIn} from './src/api/auth'; // ✅ 추가

// 온보딩 & 인증 화면
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import LoginScreen from './src/screens/user/LoginScreen';
import SignupScreen from './src/screens/user/SignupScreen';
import FindAccountScreen from './src/screens/user/FindAccountScreen';
import ResetPasswordScreen from './src/screens/user/ResetPasswordScreen';

// 메인 화면
import HomeScreen from './src/screens/home/HomeScreen';

// 음성 인식 화면
import VoiceScreen from './src/screens/voice/VoiceScreen';
import YoutubeShortsScreen from './src/screens/voice/YoutubeShortsScreen';

// 카메라 플로우
import CameraCaptureScreen from './src/screens/camera/CameraCaptureScreen';
import IngredientResultScreen from './src/screens/camera/IngredientResultScreen';
import SaveOptionScreen from './src/screens/camera/SaveOptionScreen';
import RecipeFilterScreen from './src/screens/camera/RecipeFilterScreen';
import IngredientSelectionScreen from './src/screens/camera/IngredientSelectionScreen';
import RecommendedRecipesScreen from './src/screens/camera/RecommendedRecipesScreen';
import RecipeDetailScreen from './src/screens/camera/RecipeDetailScreen';

// 레시피 플로우
import RecipeSelectionScreen from './src/screens/recipe/RecipeSelectionScreen';
import IngredientInputScreen from './src/screens/recipe/IngredientInputScreen';
import RecipeBoardScreen from './src/screens/recipeboard/RecipeBoardScreen';
import RecipeBoardDetailScreen from './src/screens/recipeboard/RecipeDetailScreen';

// 영수증 플로우
import ReceiptSelectionScreen from './src/screens/receipt/ReceiptSelectionScreen';
import GalleryScreen from './src/screens/receipt/GalleryScreen';

// 지도 플로우
import MapMainScreen from './src/screens/map/MapMainScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 마이페이지
import ProfileScreen from './src/screens/mypage/ProfileScreen';
import IngredientManagementScreen from './src/screens/mypage/IngredientManagementScreen';
import ReceivedReviewsScreen from './src/screens/mypage/ReceivedReviewsScreen';
import SavedRecipesScreen from './src/screens/mypage/SavedRecipesScreen';
import SharedRecipesScreen from './src/screens/mypage/SharedRecipesScreen';
import ReportHistoryScreen from './src/screens/mypage/ReportHistoryScreen';

// 설정 화면
import SettingsScreen from './src/screens/settings/SettingsScreen';
import ProfileEditScreen from './src/screens/settings/ProfileEditScreen';
import PasswordChangeScreen from './src/screens/settings/PasswordChangeScreen';
import NotificationSettingsScreen from './src/screens/settings/NotificationSettingsScreen';
import PrivacyPolicyScreen from './src/screens/settings/PrivacyPolicyScreen';
import AppInfoScreen from './src/screens/settings/AppInfoScreen';

// 관리자 화면
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import UserManagementScreen from './src/screens/admin/UserManagementScreen';
import ReportManagementScreen from './src/screens/admin/ReportManagementScreen';
import PostManagementScreen from './src/screens/admin/PostManagementScreen';
import NoticeManagementScreen from './src/screens/admin/NoticeManagementScreen';
import NoticeFormScreen from './src/screens/admin/NoticeFormScreen';

// 공지사항 화면
import NotificationListScreen from './src/screens/notification/NotificationListScreen';
import NotificationDetailScreen from './src/screens/notification/NotificationDetailScreen';

/**
 * 메인 하단 탭 네비게이터
 * Metaball 스타일의 커스텀 네비게이션 바 사용
 */
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <MetaballNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      {/* 하단 4개 탭 */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="RecipeBoard" component={RecipeBoardScreen} />
      <Tab.Screen name="Notification" component={NotificationListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* FAB 서브메뉴 화면들 */}
      <Tab.Screen
        name="Camera"
        component={CameraCaptureScreen}
        options={{
          tabBarButton: () => null, // 탭 바 완전히 숨김
        }}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="YoutubeShortsScreen"
        component={YoutubeShortsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen name="Recipe" component={RecipeSelectionScreen} />
      <Tab.Screen name="Receipt" component={ReceiptSelectionScreen} />
      <Tab.Screen name="Map" component={MapMainScreen} />

      {/* 카메라 플로우 서브 화면들 (탭바 숨김) */}
      <Tab.Screen
        name="IngredientResult"
        component={IngredientResultScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="SaveOption"
        component={SaveOptionScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RecipeFilter"
        component={RecipeFilterScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="IngredientSelection"
        component={IngredientSelectionScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RecommendedRecipes"
        component={RecommendedRecipesScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 게시판 상세 (탭바 숨김) */}
      <Tab.Screen
        name="RecipeBoardDetail"
        component={RecipeBoardDetailScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 레시피 플로우 서브 화면들 (탭바 숨김) */}
      <Tab.Screen
        name="IngredientInput"
        component={IngredientInputScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 영수증 플로우 서브 화면들 (탭바 숨김) */}
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 마이페이지 서브 화면들 (탭바 숨김) */}
      <Tab.Screen
        name="IngredientManagement"
        component={IngredientManagementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ReceivedReviews"
        component={ReceivedReviewsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="SavedRecipes"
        component={SavedRecipesScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="SharedRecipes"
        component={SharedRecipesScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ReportHistory"
        component={ReportHistoryScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 설정 화면 (탭바 숨김) */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="PasswordChange"
        component={PasswordChangeScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AppInfo"
        component={AppInfoScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AdminSettings"
        component={AdminSettingsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ReportManagement"
        component={ReportManagementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="PostManagement"
        component={PostManagementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="NoticeManagement"
        component={NoticeManagementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="NoticeForm"
        component={NoticeFormScreen}
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* 공지사항 상세 화면 (탭바 숨김) */}
      <Tab.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * 루트 앱 컴포넌트
 *
 * 화면 플로우:
 * 1. 최초 실행: Onboarding → Login
 * 2. 재실행 (로그인 상태): MainApp (Home)
 * 3. 로그인 필요: Login → Signup / FindAccount
 * 4. 로그인 성공: MainApp
 */
function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    checkFirstLaunch();
    initializeFCM();
    initGoogleSignIn(); // ✅ 구글 로그인 SDK 초기화
  }, []);

  // FCM 초기화 및 푸시 알림 리스너 설정
  const initializeFCM = async () => {
    try {
      // Notifee 초기화
      await initNotification();

      // ⚠️ 권한 요청은 HomeScreen에서 실행 (setupFCM 제거)

      // 🔥 포그라운드 메시지 수신 (앱 실행 중)
      const unsubscribeForeground = messaging().onMessage(
        async remoteMessage => {
          await displayFCMNotification(remoteMessage);
        },
      );

      messaging().onNotificationOpenedApp(remoteMessage => {
        handleNotificationClick(remoteMessage);
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            handleNotificationClick(remoteMessage);
          }
        });

      return () => {
        unsubscribeForeground();
      };
    } catch (error) {
      console.error('[FCM 초기화 실패]', error);
    }
  };

  // 알림 클릭 처리 (채팅방으로 이동)
  const handleNotificationClick = remoteMessage => {
    try {
      const {data} = remoteMessage;

      // 알림 데이터에 따른 화면 이동 처리
      // 예: chatRoomId가 있으면 채팅방으로 이동
      if (data?.chatRoomId && navigationRef.current) {
        // 메인 화면으로 먼저 이동 후 채팅방 열기
        navigationRef.current.navigate('MainApp', {
          screen: 'Map',
          params: {
            openChatRoom: true,
            chatRoomId: data.chatRoomId,
          },
        });
      }

    } catch (error) {
      if (__DEV__) console.error('[알림 클릭 처리 실패]', error);
    }
  };

  // 최초 실행 여부 및 로그인 상태 체크
  const checkFirstLaunch = async () => {
    try {
      // ✅ userId로 로그인 상태 확인 (accessToken 사용 안 함)
      const userId = await AsyncStorage.getItem('userId');

      // 온보딩 항상 표시 (개발용)
      setIsFirstLaunch(true);
      setIsLoggedIn(userId !== null); // ✅ userId 기준으로 변경
    } catch (error) {
      console.error('앱 초기화 에러:', error);
      setIsFirstLaunch(true);
      setIsLoggedIn(false);
    }
  };

  // 로딩 중
  if (isFirstLaunch === null || isLoggedIn === null) {
    return null; // 스플래시 화면 추가 (추후 구현)
  }

  // 초기 화면 결정 - 항상 온보딩부터 시작
  const getInitialRouteName = () => {
    return 'Onboarding'; // 항상 온보딩
  };

  return (
    <SafeAreaProvider>
      <PortalProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName={getInitialRouteName()}
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            {/* 온보딩 */}
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />

            {/* 인증 화면들 */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="FindAccount" component={FindAccountScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />

            {/* 메인 앱 (하단 탭 네비게이션) */}
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PortalProvider>
    </SafeAreaProvider>
  );
}

export default App;
