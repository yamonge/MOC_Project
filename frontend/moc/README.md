# moc - React Native 프로젝트

AI 레시피 추천 / 공동구매 앱 프로젝트의 React Native 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 설치](#프로젝트-설치)
- [실행 방법](#실행-방법)
- [주요 라이브러리](#주요-라이브러리)
- [트러블슈팅](#트러블슈팅)

---

## 🎯 프로젝트 개요

AI 레시피 추천 / 공동구매 플랫폼 모바일 애플리케이션

**버전:** 0.0.1  
**최소 Node 버전:** 18 이상

---

## 🛠 기술 스택

### Core

- **React Native:** 0.78.3
- **React:** 19.0.0
- **JavaScript:** ES6+ (TypeScript 설정 포함: 5.0.4)

### Navigation
- **@react-navigation/native:** ^7.1.24
- **@react-navigation/bottom-tabs:** ^7.0.0
- **@react-navigation/native-stack:** ^7.8.5
- **react-native-screens:** ^4.18.0
- **react-native-safe-area-context:** ^5.6.2

### UI/Animation

- **react-native-reanimated:** ^4.1.5
- **@shopify/react-native-skia:** ^2.4.6
- **lottie-react-native:** ^7.3.4
- **react-native-linear-gradient:** ^2.8.3
- **@react-native-community/blur:** ^4.4.1
- **react-native-gesture-handler:** ^2.29.1

### Graphics & Icons

- **react-native-svg:** ^15.15.0
- **react-native-vector-icons:** ^10.2.0
- **lucide-react-native:** ^0.554.0

### UI Components

- **@gorhom/bottom-sheet:** ^5.2.8 (BottomSheet 컴포넌트)
- **@gorhom/portal:** ^1.0.14 (Portal/최상위 레이어 렌더링)
- **@react-native-community/slider:** ^5.1.1 (슬라이더)
- **@react-native-picker/picker:** ^2.10.0 (Picker)
- **react-native-wheel-pick:** ^1.2.6 (휠 피커)
- **react-native-swipe-list-view:** ^3.2.9 (스와이프 리스트뷰)
- **react-native-modal:** ^13.0.2 (모달 컴포넌트)

### Media & Camera
- **react-native-vision-camera:** ^4.7.3
- **react-native-image-picker:** ^7.2.0
- **@react-native-camera-roll/camera-roll:** ^7.10.2 (갤러리/카메라롤 접근)

### Network

- **axios:** ^1.7.0
- **@stomp/stompjs:** ^7.2.1 (WebSocket/STOMP 프로토콜 클라이언트)
- **sockjs-client:** ^1.6.1 (SockJS WebSocket 클라이언트)

### Map & Location

- **@mj-studio/react-native-naver-map:** ^2.6.7 (네이버 지도 SDK)
- **@react-native-community/geolocation:** ^3.4.0 (위치 정보)

### Storage

- **@react-native-async-storage/async-storage:** ^2.1.0 (로컬 저장소)

### Utilities

- **date-fns:** ^4.1.0 (날짜/시간 포매팅 및 조작)
- **geolib:** ^3.3.4 (지리적 좌표 계산 - 거리, 방향 등)
- **text-encoding:** ^0.7.0 (텍스트 인코딩/디코딩 폴리필)

### Keyboard

- **react-native-keyboard-aware-scroll-view:** ^0.9.5 (키보드 인식 스크롤)

### Push Notification

- **@notifee/react-native:** ^9.1.8 (로컬/푸시 알림)
- **@react-native-firebase/app:** ^23.7.0 (Firebase 코어)
- **@react-native-firebase/messaging:** ^23.7.0 (Firebase Cloud Messaging)

### Performance

- **react-native-worklets:** ^0.6.1

### Development Tools
- **react-native-svg-transformer:** ^1.5.2 (SVG 파일을 React 컴포넌트로 변환)

### 한방 설치 명령어
```bash
npm install @react-navigation/native@^7.1.24 @react-navigation/bottom-tabs@^7.0.0 @react-navigation/native-stack@^7.8.5 react-native-screens@^4.18.0 react-native-safe-area-context@^5.6.2 react-native-reanimated@^4.1.5 react-native-gesture-handler@^2.29.1 @shopify/react-native-skia@^2.4.6 lottie-react-native@^7.3.4 react-native-linear-gradient@^2.8.3 @react-native-community/blur@^4.4.1 react-native-svg@^15.15.0 react-native-vector-icons@^10.2.0 lucide-react-native@^0.554.0 @gorhom/bottom-sheet@^5.2.8 @gorhom/portal@^1.0.14 @react-native-community/slider@^5.1.1 @react-native-async-storage/async-storage@^2.1.0 @react-native-picker/picker@^2.10.0 react-native-wheel-pick@^1.2.6 react-native-swipe-list-view@^3.2.9 react-native-modal@^13.0.2 react-native-vision-camera@^4.7.3 react-native-image-picker@^7.2.0 @react-native-camera-roll/camera-roll@^7.10.2 axios@^1.7.0 @stomp/stompjs@^7.2.1 sockjs-client@^1.6.1 react-native-worklets@^0.6.1 @mj-studio/react-native-naver-map@^2.6.7 @react-native-community/geolocation@^3.4.0 date-fns@^4.1.0 geolib@^3.3.4 text-encoding@^0.7.0 react-native-keyboard-aware-scroll-view@^0.9.5 @notifee/react-native@^9.1.8 @react-native-firebase/app@^23.7.0 @react-native-firebase/messaging@^23.7.0

npm install zustand --legacy-peer-deps
npm install react-native-svg-transformer@^1.5.2 --save-dev
npm install react-native-svg-transformer@^1.5.2 --save-dev --legacy-peer-deps
npm install react-native-nitro-modules --legacy-peer-deps
npm install react-native-nitro-sound --legacy-peer-deps
npm install react-native-webview --legacy-peer-deps
npm install @react-native-google-signin/google-signin react-native-fbsdk-next --legacy-peer-deps
```
---

## 💻 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- npm 9 이상
- JDK 17 (Android)
- Xcode (iOS, macOS만)

### 1. Node.js 설치 확인

```bash
node --version  # v18.x 이상
npm --version   # v9.x 이상
```

### 2. 개발 도구 설치

#### Android 개발 환경 (Windows/macOS/Linux)

1. **JDK 17 설치**

   - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) 또는 [OpenJDK](https://adoptium.net/)
   - 환경변수 `JAVA_HOME` 설정

2. **Android Studio 설치**
   - [Android Studio](https://developer.android.com/studio) 다운로드
   - SDK Manager에서 설치:
     - Android SDK Platform 34
     - Android SDK Build-Tools
     - Android Emulator
   - 환경변수 설정:
     - `ANDROID_HOME`: Android SDK 경로
     - `PATH`에 추가: `platform-tools`

#### iOS 개발 환경 (macOS만)

1. **Xcode 설치** (App Store)
2. **Command Line Tools 설치**
   ```bash
   xcode-select --install
   ```
3. **CocoaPods 설치**
   ```bash
   sudo gem install cocoapods
   ```

---

## 📦 프로젝트 설치

### 1. 저장소 클론

```bash
git clone [repository-url]
cd testpro01/frontend/testpro2
```

### 2. 의존성 설치

```bash
npm install
```

### 3. iOS 의존성 설치 (macOS만)

> **Note**: Make sure you have completed the environment setup above before proceeding.

```bash
# Ruby 번들러 설치 (최초 1회)
bundle install

# Pod 설치 (필수)
cd ios
pod install
cd ..
```

---

## 🚀 실행 방법

### Step 1: Metro 번들러 시작

Metro는 React Native의 JavaScript 빌드 도구입니다.

```bash
npm start
```

**또는 캐시를 초기화하려면:**

```bash
npm start -- --reset-cache
```

### Step 2: 앱 실행

Metro가 실행 중인 상태에서 **새 터미널**을 열고 다음 명령어를 실행하세요.

#### Android

```bash
npm run android
```

**에뮬레이터가 없는 경우:**

1. Android Studio 실행
2. AVD Manager에서 가상 기기 생성 및 실행
3. `npm run android` 재실행

#### iOS (macOS만)

```bash
npm run ios
```

**시뮬레이터 선택:**

```bash
# iPhone 15 Pro 실행
npm run ios -- --simulator="iPhone 15 Pro"
```

---

## 📚 주요 라이브러리 사용법

### Navigation (React Navigation)

```javascript
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### Animation (Reanimated)

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function AnimatedComponent() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: withSpring(offset.value * 255)}],
  }));

  return <Animated.View style={animatedStyles} />;
}
```

### Lottie Animation

```javascript
import LottieView from 'lottie-react-native';

function Animation() {
  return <LottieView source={require('./animation.json')} autoPlay loop />;
}
```

### Linear Gradient

```javascript
import LinearGradient from 'react-native-linear-gradient';

function GradientButton() {
  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
      <Text>Sign in with Facebook</Text>
    </LinearGradient>
  );
}
```

### Vector Icons

```javascript
import Icon from 'react-native-vector-icons/MaterialIcons';

function IconExample() {
  return <Icon name="rocket" size={30} color="#900" />;
}
```

---

## 🔧 유용한 스크립트

```bash
# Android 실행
npm run android

# iOS 실행
npm run ios

# Metro 시작
npm start

# ESLint 검사
npm run lint

# 테스트 실행
npm test

# TypeScript 타입 체크
npx tsc --noEmit
```

---

## ⚠️ 트러블슈팅

### 1. Metro 번들러 캐시 문제

```bash
npm start -- --reset-cache
```

### 2. Android 빌드 실패

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### 3. iOS 빌드 실패 (macOS)

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### 4. node_modules 오류

```bash
rm -rf node_modules package-lock.json
npm install
```

### 5. 포트 8081 충돌

**Windows:**

```cmd
netstat -ano | findstr :8081
taskkill /PID [PID번호] /F
```

**macOS/Linux:**

```bash
lsof -ti:8081 | xargs kill
```

### 6. Watchman 오류 (macOS/Linux)

```bash
brew install watchman
```

### 7. Gradle 메모리 오류 (Android)

`android/gradle.properties`에 추가:

```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m
```

---

## 📁 프로젝트 구조 (권장)

```
pro/
├── android/              # Android 네이티브 코드
├── ios/                  # iOS 네이티브 코드
├── src/
│   ├── components/       # 재사용 컴포넌트
│   ├── screens/          # 화면 컴포넌트
│   ├── navigation/       # 네비게이션 설정
│   ├── assets/           # 이미지, 폰트
│   ├── utils/            # 유틸리티 함수
│   └── types/            # TypeScript 타입
├── App.tsx               # 앱 진입점
├── package.json
└── tsconfig.json
```

---

## 🔍 개발 도구 추천

### VS Code Extensions

- React Native Tools
- ESLint
- Prettier - Code formatter
- React Native Snippet

### 디버깅 도구

- **React Native Debugger**: 전용 디버거
- **Flipper**: 네이티브 디버깅 및 네트워크 모니터링

---

## 🤝 기여 가이드

1. 기능 브랜치 생성: `git checkout -b feature/기능명`
2. 변경사항 커밋: `git commit -m "feat: 기능 추가"`
3. 브랜치 푸시: `git push origin feature/기능명`
4. Pull Request 생성

---

## 📞 문의

문제가 발생하거나 질문이 있는 경우 팀 채널을 통해 문의해주세요.

---

**마지막 업데이트:** 2025년 12월 2일
