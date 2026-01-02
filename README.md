# 🍳 MOC (My Own Cook) - AI 레시피 추천 및 공동구매 플랫폼

> **AI 기반 개인 맞춤형 레시피 추천 및 지역 기반 공동구매 서비스를 제공하는 모바일 애플리케이션**

[![React Native](https://img.shields.io/badge/React%20Native-0.78.3-61DAFB?logo=react)](https://reactnative.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://www.oracle.com/java/)
[![Oracle DB](https://img.shields.io/badge/Oracle%20DB-11g-red?logo=oracle)](https://www.oracle.com/database/)

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 API 엔드포인트](#-주요-api-엔드포인트)
- [설치 및 실행 방법](#-설치-및-실행-방법)
- [개발 환경 설정](#-개발-환경-설정)
- [주요 기술적 도전과제](#-주요-기술적-도전과제)
- [프로젝트 하이라이트](#-프로젝트-하이라이트)

---

## 🎯 프로젝트 개요

**MOC (My Own Cook)**는 사용자가 보유한 재료를 기반으로 AI가 맞춤형 레시피를 추천하고, 지역 기반 공동구매를 통해 효율적인 식재료 구매를 지원하는 모바일 애플리케이션입니다.

### 핵심 가치

- 🤖 **AI 기반 개인화**: Google Gemini AI를 활용한 사용자 맞춤형 레시피 추천
- 📸 **이미지 인식**: 카메라를 통한 재료 인식 및 영수증 OCR 처리
- 🗺️ **지역 기반 서비스**: 네이버 지도 API를 활용한 위치 기반 공동구매 매칭
- 💬 **실시간 채팅**: WebSocket(STOMP) 기반 공동구매 채팅 시스템
- 🔔 **푸시 알림**: Firebase Cloud Messaging을 통한 실시간 알림

---

## ✨ 주요 기능

### 1. AI 레시피 추천 시스템
- **재료 기반 추천**: 사용자가 보유한 재료를 입력하거나 카메라로 촬영하여 레시피 추천
- **필터링 옵션**: 조리 시간, 난이도, 음식 종류 등 다양한 필터 적용
- **레시피 상세 정보**: 단계별 조리법, 재료 목록, 영양 정보 제공
- **레시피 저장 및 공유**: 추천받은 레시피를 저장하고 다른 사용자와 공유

### 2. 재료 관리 시스템
- **재료 등록**: 수동 입력 또는 카메라 촬영을 통한 재료 등록
- **재료 사용 기록**: 레시피 생성 시 자동으로 재료 소비 기록

### 3. 영수증 OCR 처리
- **영수증 이미지 인식**: 촬영한 영수증에서 구매한 재료 자동 추출
- **재료 자동 등록**: OCR 결과를 기반으로 재료 목록 자동 업데이트

### 4. 공동구매 플랫폼
- **지역 기반 매칭**: 사용자 위치 기반 주변 공동구매 게시글 조회
- **실시간 채팅**: WebSocket 기반 공동구매 참여자 간 실시간 채팅
- **게시글 관리**: 공동구매 게시글 작성, 수정, 삭제 및 참여 관리

### 5. 음성 인식 기능
- **음성 입력**: OpenAI Whisper API를 활용한 음성 기반 재료 입력
- **YouTube Shorts 연동**: 음성으로 검색한 레시피의 YouTube Shorts 영상 제공

### 6. 사용자 관리
- **소셜 로그인**: Google, Facebook 소셜 로그인 지원
- **프로필 관리**: 사용자 프로필 수정, 비밀번호 변경
- **리뷰 시스템**: 레시피에 대한 리뷰 작성 및 평가
- **신고 기능**: 부적절한 콘텐츠 신고 및 관리자 처리

### 7. 관리자 시스템
- **사용자 관리**: 사용자 목록 조회, 권한 관리
- **게시글 관리**: 레시피, 공동구매 게시글 관리
- **신고 처리**: 사용자 신고 내역 조회 및 처리
- **통계 대시보드**: 플랫폼 사용 통계 및 분석

### 8. 공지사항
- **공지사항 작성**: 관리자 공지사항 작성 및 관리
- **사용자 알림**: 공지사항 푸시 알림 발송

---

## 🛠 기술 스택

### Frontend (React Native)

#### Core
- **React Native**: 0.78.3
- **React**: 19.0.0
- **JavaScript**: ES6+ (TypeScript 설정 포함)

#### Navigation
- `@react-navigation/native`: ^7.1.21
- `@react-navigation/bottom-tabs`: ^7.0.0
- `@react-navigation/native-stack`: ^7.8.5

#### UI/Animation
- `react-native-reanimated`: ^4.1.5 - 고성능 애니메이션
- `@shopify/react-native-skia`: ^2.4.6 - 커스텀 네비게이션 바 (Metaball 효과)
- `lottie-react-native`: ^7.3.4 - Lottie 애니메이션
- `react-native-linear-gradient`: ^2.8.3 - 그라데이션 효과
- `@gorhom/bottom-sheet`: ^5.2.8 - Bottom Sheet 컴포넌트

#### Media & Camera
- `react-native-vision-camera`: ^4.7.3 - 카메라 기능
- `react-native-image-picker`: ^7.2.0 - 이미지 선택
- `@react-native-camera-roll/camera-roll`: ^7.10.2 - 갤러리 접근

#### Map & Location
- `@mj-studio/react-native-naver-map`: ^2.6.7 - 네이버 지도
- `@react-native-community/geolocation`: ^3.4.0 - 위치 정보

#### Network & Real-time
- `axios`: ^1.7.0 - HTTP 클라이언트
- `@stomp/stompjs`: ^7.2.1 - WebSocket/STOMP 프로토콜
- `sockjs-client`: ^1.6.1 - SockJS 클라이언트

#### Push Notification
- `@react-native-firebase/messaging`: ^23.7.0 - Firebase Cloud Messaging
- `@notifee/react-native`: ^9.1.8 - 로컬 알림

#### State Management
- `zustand`: ^5.0.9 - 경량 상태 관리

### Backend (Spring Boot)

#### Core
- **Spring Boot**: 3.5.9-SNAPSHOT
- **Java**: 17
- **Gradle**: 빌드 도구

#### Framework & Libraries
- `spring-boot-starter-web` - RESTful API
- `spring-boot-starter-websocket` - WebSocket 지원
- `spring-boot-starter-webflux` - 비동기 처리
- `mybatis-spring-boot-starter`: 3.0.5 - MyBatis ORM
- `spring-security-crypto` - 비밀번호 암호화 (BCrypt)
- `spring-boot-starter-mail` - 이메일 발송

#### Database
- **Oracle Database**: 11g (JDBC Driver: ojdbc11)
- **MyBatis**: SQL 매퍼

#### External APIs & Services
- **Google Gemini AI**: 1.0.0 - AI 레시피 추천
- **Firebase Admin SDK**: 9.2.0 - 푸시 알림
- **YouTube Data API v3** - 레시피 영상 검색
- **OpenAI Whisper API** - 음성 인식
- **Naver Search API** - 장소 검색
- **Naver Cloud API** - Reverse Geocoding

#### Utilities
- `lombok` - 보일러플레이트 코드 제거
- `jackson-databind` - JSON 처리

### Database
- **Oracle Database 11g**
- **MyBatis XML Mapper** - SQL 쿼리 관리

### Infrastructure & DevOps
- **Firebase**: Cloud Messaging, Storage
- **Ngrok**: 개발 환경 터널링
- **Gradle**: 빌드 자동화

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Mobile App                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │  Recipe  │  │   Map    │  │  Profile │   │
│  │  Screen  │  │  Board   │  │  Screen  │  │  Screen  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ WebSocket (STOMP)
                            │
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Port: 8090)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (REST API)                              │  │
│  │  - RecipeController, UserController,                 │  │
│  │    ShoppingPostController, ChatController, etc.      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  │  - RecipeService, UserService,                       │  │
│  │    ShoppingPostService, ChatService, etc.            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  DAO Layer (MyBatis)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JDBC
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Oracle Database 11g                        │
│  - Users, Recipes, Ingredients, Shopping Posts,           │
│    Chat Messages, Notices, Reports, etc.                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              External Services Integration                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Google       │  │ Firebase     │  │ Naver        │     │
│  │ Gemini AI    │  │ Cloud        │  │ Maps API     │     │
│  └──────────────┘  │ Messaging    │  └──────────────┘     │
│  ┌──────────────┐  └──────────────┘  ┌──────────────┐     │
│  │ OpenAI       │                    │ YouTube       │     │
│  │ Whisper API  │                    │ Data API v3   │     │
│  └──────────────┘                    └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 프로젝트 구조

```
3st_human_project/
├── frontend/
│   └── moc/                          # React Native 앱
│       ├── src/
│       │   ├── api/                  # API 통신 모듈
│       │   │   ├── auth.js
│       │   │   ├── recipe.js
│       │   │   ├── camera.js
│       │   │   ├── chat.js
│       │   │   ├── map.js
│       │   │   └── ...
│       │   ├── components/            # 재사용 컴포넌트
│       │   │   ├── common/
│       │   │   ├── camera/
│       │   │   ├── chat/
│       │   │   ├── map/
│       │   │   └── ...
│       │   ├── screens/               # 화면 컴포넌트
│       │   │   ├── home/
│       │   │   ├── camera/
│       │   │   ├── recipe/
│       │   │   ├── map/
│       │   │   ├── mypage/
│       │   │   ├── admin/
│       │   │   └── ...
│       │   ├── navigation/           # 네비게이션 설정
│       │   │   └── MetaballNavigation.js
│       │   ├── stores/               # 상태 관리 (Zustand)
│       │   │   └── chatStore.js
│       │   ├── utils/                # 유틸리티 함수
│       │   │   ├── StompClient.js
│       │   │   ├── notificationService.js
│       │   │   └── ...
│       │   └── assets/               # 이미지, 폰트, 애니메이션
│       ├── android/                  # Android 네이티브 코드
│       ├── ios/                      # iOS 네이티브 코드
│       ├── App.js                    # 앱 진입점
│       └── package.json
│
└── backend/
    └── moc/                          # Spring Boot 서버
        ├── src/
        │   └── main/
        │       ├── java/
        │       │   └── com/
        │       │       └── cucook/
        │       │           └── moc/
        │       │               ├── admin/          # 관리자 기능
        │       │               ├── auth/           # 인증 (Google, Facebook)
        │       │               ├── chat/           # 채팅 (WebSocket)
        │       │               ├── common/         # 공통 유틸리티
        │       │               ├── config/        # 설정 클래스
        │       │               ├── map/            # 지도 API
        │       │               ├── notice/        # 공지사항
        │       │               ├── receipt/       # 영수증 OCR
        │       │               ├── recipe/        # 레시피 관련
        │       │               ├── security/       # 보안 설정
        │       │               ├── shopping/       # 공동구매
        │       │               ├── user/          # 사용자 관리
        │       │               └── voice/        # 음성 인식
        │       └── resources/
        │           ├── application.yml           # 설정 파일
        │           ├── mybatis/
        │           │   └── mappers/             # MyBatis XML 매퍼
        │           └── static/                  # 정적 리소스
        └── build.gradle
```

---

## 🔌 주요 API 엔드포인트

### 인증 (Authentication)
```
POST   /api/auth/signup              # 회원가입
POST   /api/auth/login               # 로그인
POST   /api/auth/google              # Google 소셜 로그인
POST   /api/auth/facebook            # Facebook 소셜 로그인
GET    /api/auth/check-email         # 이메일 중복 확인
POST   /api/auth/check-nickname      # 닉네임 중복 확인
```

### 레시피 (Recipe)
```
POST   /api/recipes/recommend        # AI 레시피 추천
GET    /api/recipes/{recipeId}      # 레시피 상세 조회
POST   /api/v1/users/{userId}/recipes  # 레시피 저장
GET    /api/recipe-board             # 레시피 게시판 목록
POST   /api/recipes/{recipeId}/like  # 레시피 좋아요
POST   /api/recipes/{recipeId}/bookmark  # 레시피 북마크
```

### 사용자 (User)
```
GET    /api/v1/users/{userId}/mypage/counts  # 마이페이지 통계
GET    /api/v1/users/{userId}/ingredients     # 사용자 재료 목록
POST   /api/v1/users/{userId}/ingredients     # 재료 등록
PUT    /api/v1/users/{userId}/profile         # 프로필 수정
POST   /api/v1/users/{userId}/password        # 비밀번호 변경
```

### 공동구매 (Shopping)
```
GET    /api/shopping-posts/nearby    # 주변 공동구매 게시글
GET    /api/shopping-posts/{postId} # 게시글 상세
POST   /api/shopping-posts           # 게시글 작성
POST   /api/shopping-posts/{postId}/join  # 공동구매 참여
```

### 채팅 (Chat)
```
GET    /api/chat/rooms               # 채팅방 목록
GET    /api/chat/rooms/{roomId}/messages  # 메시지 조회
WebSocket /ws/chat                   # 실시간 채팅
```

### 영수증 OCR
```
POST   /api/receipt/ocr              # 영수증 OCR 처리
POST   /api/receipt/recognize        # 영수증 인식
```

### 음성 인식
```
POST   /api/voice/transcribe         # 음성 텍스트 변환
```

### 관리자 (Admin)
```
GET    /api/admin/users              # 사용자 목록
GET    /api/admin/recipes            # 레시피 목록
GET    /api/admin/reports            # 신고 내역
GET    /api/admin/stats              # 통계 정보
POST   /api/admin/notices            # 공지사항 작성
```

---

## 🚀 설치 및 실행 방법

### 사전 요구사항

#### Frontend
- Node.js 18 이상
- npm 9 이상
- Android Studio (Android 개발)

#### Backend
- JDK 17
- Oracle Database 11g
- Gradle 7.x 이상

### Frontend 설정

1. **의존성 설치**
```bash
cd frontend/moc
npm install
```

2. **Metro 번들러 실행**
```bash
npm start
```

3. **앱 실행**
```bash
# Android
npm run android
```

### Backend 설정

1. **Oracle Database 설정**
   - Oracle Database 11g 설치 및 실행
   - 데이터베이스 및 사용자 생성
   - 테이블 생성 (DDL 스크립트 실행)

2. **설정 파일 수정**
   - `backend/moc/src/main/resources/application.yml` 수정
   - 데이터베이스 연결 정보 설정
   - 외부 API 키 설정 (Gemini, Firebase, Naver, YouTube 등)

3. **빌드 및 실행**
```bash
cd backend/moc
./gradlew build
./gradlew bootRun
```

서버는 `http://localhost:8090`에서 실행됩니다.

---

## ⚙️ 개발 환경 설정

### Frontend 환경 변수

프로젝트 루트에 `.env` 파일 생성 (필요시):

```env
API_BASE_URL=http://localhost:8090
FIREBASE_API_KEY=your_firebase_key
GOOGLE_SIGNIN_CLIENT_ID=your_google_client_id
```

### Backend 설정 파일

`application.yml` 주요 설정:

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:XE
    username: 서버이름
    password: 서버비밀번호

server:
  port: 8090

gemini:
  api:
    key: your_gemini_api_key

firebase:
  service-account: firebase-service-account.json
```

### 외부 API 키 설정

다음 API 키를 발급받아 설정해야 합니다:

1. **Google Gemini AI**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Firebase**: [Firebase Console](https://console.firebase.google.com/)
3. **Naver Cloud Platform**: [Naver Cloud Platform](https://www.ncloud.com/)
4. **YouTube Data API**: [Google Cloud Console](https://console.cloud.google.com/)
5. **OpenAI API**: [OpenAI Platform](https://platform.openai.com/)

---

## 🎯 주요 기술적 도전과제

### 1. AI 레시피 추천 시스템 구현
- **도전**: 사용자 재료와 선호도를 기반으로 개인화된 레시피 생성
- **해결**: Google Gemini AI를 활용한 프롬프트 엔지니어링 및 JSON 파싱 로직 구현
- **결과**: 사용자 재료 기반 맞춤형 레시피 추천 성공률 향상

### 2. 실시간 채팅 시스템
- **도전**: 공동구매 참여자 간 실시간 메시지 교환
- **해결**: Spring WebSocket + STOMP 프로토콜 구현, React Native에서 SockJS 클라이언트 연동
- **결과**: 낮은 지연시간의 실시간 채팅 기능 구현

### 3. 이미지 인식 및 OCR 처리
- **도전**: 카메라로 촬영한 재료 이미지 인식 및 영수증 텍스트 추출
- **해결**: Vision Camera 라이브러리 활용, 백엔드 OCR API 연동
- **결과**: 사용자 편의성 향상 (수동 입력 불필요)

### 4. 위치 기반 공동구매 매칭
- **도전**: 사용자 위치 기반 주변 공동구매 게시글 효율적 조회
- **해결**: 네이버 지도 API + 거리 계산 알고리즘 (Haversine formula) 구현
- **결과**: 사용자 위치 기준 최적화된 공동구매 매칭

### 5. 커스텀 네비게이션 바 (Metaball 효과)
- **도전**: React Native에서 고급 애니메이션 효과 구현
- **해결**: React Native Skia를 활용한 커스텀 네비게이션 바 개발
- **결과**: 독특하고 매력적인 UI/UX 제공

### 6. 푸시 알림 시스템
- **도전**: 다양한 이벤트에 대한 실시간 알림 전송
- **해결**: Firebase Cloud Messaging 통합, 백엔드 알림 서비스 구현
- **결과**: 사용자 참여도 및 재방문률 향상

---

## 🌟 프로젝트 하이라이트

### 기술적 성과
- ✅ **Full-Stack 개발**: React Native + Spring Boot 풀스택 개발 경험
- ✅ **AI 통합**: Google Gemini AI를 활용한 지능형 레시피 추천 시스템
- ✅ **실시간 통신**: WebSocket 기반 실시간 채팅 시스템 구현
- ✅ **이미지 처리**: 카메라 및 OCR 기능을 통한 사용자 경험 개선
- ✅ **지도 API 연동**: 네이버 지도 API를 활용한 위치 기반 서비스
- ✅ **소셜 로그인**: Google, Facebook OAuth 인증 구현
- ✅ **푸시 알림**: Firebase Cloud Messaging 통합

### 아키텍처 설계
- ✅ **계층형 아키텍처**: Controller-Service-DAO 계층 분리
- ✅ **RESTful API**: 표준 REST API 설계 및 구현
- ✅ **MyBatis ORM**: 효율적인 데이터베이스 쿼리 관리
- ✅ **상태 관리**: Zustand를 활용한 경량 상태 관리

### 사용자 경험
- ✅ **직관적인 UI/UX**: 커스텀 애니메이션 및 모던한 디자인
- ✅ **다양한 입력 방식**: 카메라, 음성, 수동 입력 지원
- ✅ **실시간 피드백**: 즉각적인 알림 및 메시지 전달

---

## 📝 라이선스

이 프로젝트는 개인 포트폴리오 프로젝트입니다.

---

## 👥 팀 구성

- **프론트엔드 개발**: React Native 모바일 앱 개발
- **백엔드 개발**: Spring Boot REST API 및 WebSocket 서버 개발
- **데이터베이스 설계**: Oracle Database 스키마 설계 및 최적화

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**마지막 업데이트**: 2026년 1월 02일

