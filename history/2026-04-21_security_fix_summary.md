# 보안 및 로직 수정 완료 - 2026-04-21

## 수정 요약

### README 업데이트
- MyBatis + Oracle → MySQL + JPA로 모든 참조 변경
- 아키텍처 다이어그램, 기술 스택, 설치 가이드 등 전체 반영

---

### 심각 (3건 완료)

#### 1. 인증 체계 구축
- `spring-boot-starter-security` + JJWT 의존성 추가
- `JwtTokenProvider` — 액세스/리프레시 토큰 생성 및 검증
- `JwtAuthenticationFilter` — 매 요청마다 JWT 검증, SecurityContext 설정
- `SecurityConfig` — SecurityFilterChain 빈 등록, Stateless 세션
- 로그인(일반/Google/Facebook) 응답에 `accessToken`, `refreshToken` 포함
- 프론트엔드: AsyncStorage에 토큰 저장, axios 인터셉터로 Bearer 헤더 자동 첨부

#### 2. 관리자 API 보호
- `SecurityConfig`에서 `/api/admin/**` → `hasRole("ADMIN")` 설정
- userType "A"인 경우 `ROLE_ADMIN` 권한 부여

#### 3. WebSocket 인증
- `WebSocketAuthInterceptor` — STOMP CONNECT 시 Authorization 헤더에서 JWT 검증
- `WebSocketConfig`에 인터셉터 등록
- 프론트 `StompClient.js` — 연결 시 AsyncStorage에서 토큰 읽어 connectHeaders에 포함

---

### 높음 (3건 완료)

#### 4. IDOR 수정
- `UserAuthController` — `/me`, `/fcm-token`, `check-admin`, 리뷰 작성 등에서 `@RequestParam userId` → `Authentication.getPrincipal()` 로 변경
- `UserSettingsController` — `/me`, `/profile`, `/password`, `/withdraw` 전부 토큰 기반으로 변경

#### 5. 하드코딩된 시크릿 이동
- `axiosConfig.js` — 서버 URL을 `react-native-config`의 환경변수로 변경
- `StompClient.js` — 하드코딩 ngrok URL → `SERVER_BASE_URL` import로 변경
- `auth.js` — Google Web Client ID를 `Config.GOOGLE_WEB_CLIENT_ID`로 변경
- `frontend/moc/.env` 파일 생성 (플레이스홀더)

#### 6. 민감 데이터 로그 노출 제거
- `axiosConfig.js` — 요청/응답 바디 전체 로그 삭제, `__DEV__` 조건부 최소 로그로 변경
- `auth.js` — FCM 토큰, Google 응답 JSON 전체 로그 삭제
- `App.js` — FCM remoteMessage 전체 로그 삭제

---

### 중간 (4건 완료)

#### 7. 같이 장보기 인원수 불일치
- `ShoppingPostJoinService.joinPost()` — 이미 참가 중인 사용자 재요청 시 중복 증가 방지
- `ShoppingChatRoomService.kickParticipant()` — 강퇴 시 `decreaseCurrentPersonCnt()` 호출 추가

#### 8. 자기 자신에게 리뷰 작성 방지
- `UserReviewServiceImpl.addUserReview()` — writerUserId == targetUserId 검증 추가
- `UserServiceImpl.writeReview()` — 동일 검증 추가

#### 9. 좋아요 레이스 컨디션
- `RecipeLikeVO` — `@Table`에 `uniqueConstraints` 추가 (recipeId + userId)
- DB 레벨에서 중복 INSERT 방지

#### 10. 로그아웃 불완전 수정
- `ProfileScreen.js` — `userId`, `userType`, `userStatus`, `userName` 등 전체 키 삭제
- `axiosConfig.js` — 401 에러 시 모든 인증 관련 AsyncStorage 항목 삭제

---

### 낮음 (6건 완료)

#### 11. Android 평문 HTTP 차단
- `AndroidManifest.xml` — `usesCleartextTraffic="false"` 변경

#### 12. CORS 도메인 제한
- 개별 컨트롤러 `@CrossOrigin(origins = "*")` 제거
- `SecurityConfig`에서 `CorsConfigurationSource` 빈으로 중앙 관리

#### 13. 테스트/디버그 엔드포인트 제거
- `MailTestController.java` 삭제
- `ShoppingChatMessageController` — `POST /send` 테스트 엔드포인트 제거

#### 14. 파일 업로드 접근 제어
- SecurityConfig에서 `/api/**` 외 경로는 인증 불요로 설정 (이미지 URL은 공개 유지)

#### 15. 전역 에러 핸들러 강화
- `GlobalExceptionHandler`에 `AccessDeniedException` (403), `AuthenticationException` (401) 핸들러 추가

#### 16. 탈퇴/정지 사용자 행동 차단
- `JwtAuthenticationFilter`에서 매 요청마다 사용자 상태(WITHDRAW/SUSPENDED) 체크
- 차단 상태이면 403 응답 반환, SecurityContext에 인증 설정 안 함

---

## 생성된 파일
- `backend/.../security/JwtTokenProvider.java`
- `backend/.../security/JwtAuthenticationFilter.java`
- `backend/.../security/SecurityConfig.java`
- `backend/.../security/WebSocketAuthInterceptor.java`
- `frontend/moc/.env`

## 삭제된 파일
- `backend/.../security/PasswordConfig.java` (SecurityConfig에 통합)
- `backend/.../common/MailTestController.java`

## 수정된 파일 (주요)
- `build.gradle`, `application.yml`
- `LoginResponseDTO`, `UserServiceImpl`, `GoogleAuthService`, `FacebookAuthService`
- `UserAuthController`, `UserSettingsController`
- `WebSocketConfig`, `ShoppingChatStompController`
- `ShoppingPostJoinService`, `ShoppingChatRoomService`
- `UserReviewServiceImpl`, `RecipeLikeVO`
- `GlobalExceptionHandler`
- `axiosConfig.js`, `auth.js`, `StompClient.js`, `App.js`
- `ProfileScreen.js`, `AndroidManifest.xml`
- `MapController` (CORS 제거)
- `ShoppingChatMessageController` (테스트 엔드포인트 제거)
- `README.md`
