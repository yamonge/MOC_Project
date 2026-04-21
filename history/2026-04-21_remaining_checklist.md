# 추가 분석 후 남은 작업 체크리스트 - 2026-04-21

> 보안 감사 16건 수정 완료 후 추가 분석에서 발견된 항목

---

## 즉시 필요 (빌드/런타임 영향)

- [x] `react-native-config` 패키지 설치 — `.env` import 사용 중인데 의존성 미등록 (README 추가 완료, package.json 설치 완료)
- [x] 나머지 컨트롤러 IDOR 수정 — 11개 이상 컨트롤러 `Authentication` 기반으로 교체 완료
  - [x] `ShoppingChatRoomController` — `/me`, `/leave`, `/delete`, `/kick`
  - [x] `ShoppingPostController` — 생성, 참여, place 목록
  - [x] `ReceiptRecognitionController` — `e.printStackTrace()` 제거 + Authentication 적용
  - [x] `RecipeBookmarkController` — 경로 `{userId}` (무시) + Authentication
  - [x] `RecipeLikeController` — 경로 `{userId}` (무시) + Authentication
  - [x] `RecipeSaveController` — 경로 `{userId}` (무시) + Authentication
  - [x] `UserIngredientController` — 경로 `{userId}` (무시) + Authentication
  - [x] `UserReviewController` — 경로 `{writerUserId}` (무시) + Authentication
  - [x] `UserReportController` — 경로 `{reporterUserId}` (무시) + Authentication
  - [x] `MyPageController` — 경로 `{userId}` (무시) + Authentication
  - [x] `IngredientUseHistController` — 경로 `{userId}` (무시) + Authentication
  - [x] `RecipeReportController` — 경로 `{reporterUserId}` (무시) + Authentication
- [x] 남은 `@CrossOrigin(origins = "*")` 제거 (7개 컨트롤러)
  - [x] `UserReviewController`
  - [x] `UserIngredientController`
  - [x] `UserReportController`
  - [x] `RecipeBookmarkController`
  - [x] `RecipeReportController`
  - [x] `RecipeLikeController`
  - [x] `IngredientUseHistController`

---

## iOS 빌드 필수

> ⚠️ **현재 WSL Ubuntu 환경** — 코드/설정 파일 편집은 가능하나, 빌드/테스트는 macOS(Xcode) 필요

### WSL에서 선작업 완료 (코드 편집)
- [x] `Info.plist` 권한 설명 채우기
  - [x] `NSLocationWhenInUseUsageDescription` — 위치 권한 설명 추가
  - [x] `NSCameraUsageDescription` — 카메라 권한 설명 추가
  - [x] `NSMicrophoneUsageDescription` — 음성 녹음 권한 설명 추가
  - [x] `NSPhotoLibraryUsageDescription` — 갤러리 접근 권한 설명 추가
- [x] `AppDelegate.swift`에 Firebase 초기화 코드 추가
- [x] `Info.plist`에 `UIBackgroundModes` → `remote-notification` 추가
- [x] 소셜 로그인 iOS 설정
  - [x] Google URL Scheme → `Info.plist` `CFBundleURLSchemes` 등록 (플레이스홀더)
  - [x] Facebook SDK → `Info.plist`에 `FacebookAppID`, `FacebookClientToken`, URL Scheme 등록 (플레이스홀더)
- [x] Naver Map iOS 키 설정 (`Info.plist`에 `NMFClientId` 플레이스홀더)

### macOS 환경 필요 (빌드/배포)
- [ ] `pod install` 실행 (CocoaPods)
- [ ] `GoogleService-Info.plist` 추가 (Firebase Console → Xcode)
- [ ] APNs entitlements 파일 생성
- [ ] 앱 아이콘 PNG 등록 (`AppIcon.appiconset`)
- [ ] 서명/프로비저닝 설정 (`DEVELOPMENT_TEAM`)
- [ ] Xcode 빌드 및 시뮬레이터 테스트

---

## 백엔드 관리자 서비스 검증 통일

- [x] `AdminRecipeReportServiceImpl` — `requireAdminActive()` 검증 추가
- [x] `AdminUserReportServiceImpl` — `requireAdminActive()` 패턴 적용
- [x] `AdminRecipeServiceImpl` — `assertAdmin()`에 ACTIVE 상태 검증 추가
- [x] `AdminNoticeController` — `Authentication`으로 관리자 userId 추출
- [x] `NoticeServiceImpl` — `createdId`/`updatedId`에 관리자 userId 연동

---

## 프론트엔드 로그 정리 (프로덕션 데이터 노출 방지)

- [x] `babel-plugin-transform-remove-console` 설치 + `babel.config.js` 적용
  - 프로덕션 빌드에서 모든 `console.*` 자동 제거

---

## 백엔드 로깅 개선

- [x] `System.out.println` / `System.err.println` → SLF4J 로거 교체 (13개 파일)
  - [x] `AdminUserReportServiceImpl`
  - [x] `GlobalExceptionHandler`
  - [x] `ShoppingChatRoomService`
  - [x] `ShoppingPostJoinService`
  - [x] `RecipeServiceImpl`
  - [x] `RecipeBookmarkServiceImpl`
  - [x] `RecipeBoardServiceImpl`
  - [x] `ShoppingChatMessageService`
  - [x] `UserIngredientServiceImpl`
  - [x] `WebMvcConfig`
  - [x] `RecipeController`
  - [x] `FirebaseService`
  - [x] `FileUploadUtil`

---

## 프론트엔드 API `response.data` 이중 접근 버그

- [x] axios 인터셉터가 이미 `response.data`만 반환 → 이중 `.data` 접근 수정
  - [x] `mypage.js` — `addIngredient`
  - [x] `camera.js` — `saveIngredients`, `saveRecipe`
  - [x] `settings.js` — `getNotificationSettings`, `updateNotificationSettings`, `uploadImage`

---

## 프론트엔드 JWT/userId 이중 전송 정리

- [x] JWT만으로 식별하도록 변경, 쿼리에 userId 첨부하는 패턴 전면 제거
  - [x] `auth.js` — `getCurrentUser` userId 쿼리 제거
  - [x] `settings.js` — `meta: {requiresUserId: true}` 패턴 전면 제거
  - [x] `chat.js` — `getMyChatRooms`, `leaveChatRoom`, `deleteChatRoom`, `kickParticipant` userId/requestUserId 파라미터 제거
  - [x] `map.js` — `createPost`, `joinPost`, `getPostsByLocation` userId 파라미터 제거
  - [x] `admin.js` — `withAdminMeta()` requiresUserId 로직 제거
  - [x] `axiosConfig.js` — `meta.requiresUserId` 자동 첨부 로직 + `getUserIdOrThrow` 제거

---

## 기타

- [x] `ReceiptRecognitionController` — `e.printStackTrace()` 제거 + 에러 메시지 응답 본문 일반화
- [x] `auth.js` — Google Web Client ID 소스 내 평문 폴백 제거 (Config만 사용)
- [x] `SettingsScreen.js` — `checkAdminStatus` import 제거 (settings.js에 export 없음)
- [ ] `VoiceController /shorts/{videoId}` — 고정 테스트 데이터 반환 (TODO, 실제 YouTube API 연동 필요 — 기능 구현 단계)
- [x] `imageUrlHelper.js` — JSDoc 주석 갱신 완료 (개발 환경 폴백용으로 재정의, AWS 배포 후 자동 불필요화)

---

## AWS 배포 준비 (2026-04-21 추가)

> 상세 분석: `history/2026-04-21_aws_production_analysis.md` 참조

- [x] `application-prod.yml` 프로필 파일 생성 (환경변수 기반 프로덕션 설정)
- [x] `RecipeImageResolver.java` — `"http://localhost:8090/image/"` 하드코딩 → `@Value` 주입
- [x] `.env.production` 파일 생성 (프론트엔드 프로덕션 환경변수)
- [x] `auth.js` — `deviceOs: 'Android'` 하드코딩 → `Platform.OS` 동적 감지
- [x] `jwt.secret` — prod 프로필에서 환경변수 필수 (폴백 없음)
- [x] `jpa.ddl-auto: validate` + `show-sql: false` — prod 프로필에 적용
- [x] `StompClient.js` — 전체 console.log에 `__DEV__` 가드 추가 (20+곳)
- [x] `notificationService.js` — 전체 console.log에 `__DEV__` 가드 추가 (FCM 토큰 노출 방지 포함)
- [x] `chatStore.js` — 전체 console.log에 `__DEV__` 가드 추가 (15곳)
- [x] `build.gradle` — Spring Boot `3.5.9-SNAPSHOT` → `3.5.13` 정식 릴리스 + snapshot 저장소 제거

---

## 첫 배포 전 필수 — AWS 계정/인프라 확보 후 진행

> 코드만으로는 불가. AWS 계정, 도메인, S3 버킷 등 인프라가 선행되어야 작업 가능.  
> 상세 분석: `history/2026-04-21_aws_production_analysis.md` 참조

- [ ] S3 버킷 생성 → 파일 업로드 SDK 연동 코드 작성 (FileUploadUtil → S3Client)
- [ ] CloudFront CDN 설정 (이미지 제공용)
- [ ] 도메인 확정 → CORS Origin 제한 (`SecurityConfig`, `WebSocketConfig`)
- [ ] ALB WebSocket 스티키 세션 설정 (인프라)
- [ ] Actuator 엔드포인트 보안 (application-prod.yml 추가)
- [ ] CI/CD 파이프라인 (GitHub Actions → ECR → ECS)
- [ ] 모니터링 (CloudWatch, Actuator health)
- [ ] `MailServiceImpl` — 딥링크/앱 내 비밀번호 재설정 방식 전환 (앱 URL scheme 설계 필요)
- [ ] `.env.production`에 실제 AWS 도메인·API 키 입력
- [ ] `application-prod.yml` 환경변수에 실제 값 세팅 (Secrets Manager / SSM)
