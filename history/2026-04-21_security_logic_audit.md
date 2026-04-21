# 보안 및 로직 감사 결과 - 2026-04-21

## 심각 (즉시 수정 필요)

### 1. 인증 체계 부재
- JWT / 세션 / Spring Security 필터 체인이 전혀 없음
- 모든 API가 클라이언트가 보내는 `userId` 파라미터만으로 사용자를 식별
- `userId`만 알면 타인의 프로필 수정, 비밀번호 변경, 탈퇴, 좋아요 조작, 채팅 위장 등 전부 가능
- 해당: 거의 모든 Controller (`UserSettingsController`, `UserAuthController`, `RecipeLikeController`, `ShoppingPostController` 등)

### 2. 관리자 API 보호 부재
- `/api/admin/notices` - 관리자 검증 없이 누구나 공지 CRUD 가능
- `AdminUserReportServiceImpl` - 신고 처리에 관리자 여부 미검증
- `AdminRecipeReportServiceImpl` - `adminUserId` 파라미터를 사용하지 않고 신고를 APPROVED 처리

### 3. WebSocket 무인증
- 연결 시 토큰/세션 검증 없음, `setAllowedOriginPatterns("*")`
- 메시지의 `senderUserId`를 클라이언트가 보내므로 같은 채팅방 참가자 ID로 발신자 스푸핑 가능
- 해당: `WebSocketConfig.java`, `ShoppingChatStompController.java`, `StompClient.js`

---

## 높음 (보안 취약점)

### 4. IDOR (Insecure Direct Object Reference)
- `GET /api/auth/me?userId=` - 아무 userId로 타인 프로필 조회
- `PUT /api/users/me/profile?userId=` - 타인 프로필 수정
- `POST /api/auth/fcm-token` - 타인 FCM 토큰 덮어쓰기 (푸시 알림 가로채기)
- `DELETE /api/users/me?userId=` - 타인 탈퇴 처리
- 해당: `UserAuthController.java`, `UserSettingsController.java`

### 5. 하드코딩된 시크릿 (저장소 노출)
- `strings.xml` - Facebook App ID, Client Token
- `AndroidManifest.xml` - Naver Map Client ID (`28n51run07`)
- `auth.js` - Google OAuth Web Client ID
- `GoogleAuthService.java` - Google Web Client ID
- `axiosConfig.js`, `StompClient.js` - ngrok 서버 주소

### 6. 민감 데이터 로그 노출
- `axiosConfig.js` - 모든 요청 Body(비밀번호 포함), 모든 응답 데이터를 `console.log` 출력
- `auth.js` - FCM 토큰, Google 응답 전체 JSON 로그
- `App.js` - FCM remoteMessage 전체 로그
- 프로덕션 빌드에서도 동일하게 동작

---

## 중간 (비즈니스 로직 결함)

### 7. 같이 장보기 인원수 불일치
- 중복 참여: 같은 사용자가 `joinPost`를 두 번 호출하면 `currentPersonCnt`만 +2, 실제 참가자는 1명
- 강퇴 시 미차감: `kickParticipant`가 `decreaseCurrentPersonCnt`를 호출하지 않음
- 해당: `ShoppingPostJoinService.java`, `ShoppingChatRoomService.java`

### 8. 자기 자신에게 리뷰 작성 가능
- `writerUserId == targetUserId` 검증 없음
- 자기에게 별점 5점 반복으로 평판 조작 가능
- 해당: `UserReviewServiceImpl.java`, `UserServiceImpl.writeReview()`

### 9. 좋아요 레이스 컨디션
- `RecipeLikeVO`에 (userId, recipeId) UNIQUE 제약 없음
- 동시 요청 시 이중 INSERT + `likeCnt` +2 발생 가능
- 본인 레시피 신고에 대한 제한도 없음
- 해당: `RecipeLikeVO.java`, `RecipeLikeServiceImpl.java`

### 10. 로그아웃 불완전
- `ProfileScreen.js`에서 `userId`, `userType`, `userStatus` 등을 AsyncStorage에서 삭제하지 않음
- 401 에러 시 `userId`/`accessToken` 미삭제 + 로그인 이동 주석 처리
- 다음 앱 실행 시 깨진 인증 상태 진입 가능
- 해당: `ProfileScreen.js`, `axiosConfig.js`

---

## 낮음 (개선 권장)

### 11. Android 평문 HTTP 허용
- `AndroidManifest.xml`에 `android:usesCleartextTraffic="true"` 설정
- HTTPS가 아닌 HTTP 통신이 허용되어 중간자 공격에 취약
- 해당: `frontend/moc/android/app/src/main/AndroidManifest.xml`

### 12. CORS 전면 개방
- 다수 컨트롤러에 `@CrossOrigin(origins = "*")` 적용
- 운영 환경에서는 허용 도메인 제한 필요
- 해당: `MapController.java` 및 다수 Controller

### 13. 테스트/디버그 엔드포인트 잔존
- `/test/mail` - 고정 수신자로 메일 전송 가능 (DoS 악용 가능)
- `POST /api/chat/messages/{roomId}/send` - REST로 메시지 전송 가능한 테스트 API
- 해당: `MailTestController.java`, `ShoppingChatMessageController.java`

### 14. 파일 업로드 전체 공개
- `/uploads/**` 경로가 접근 제어 없이 전체 공개
- URL만 알면 모든 업로드 파일(프로필 사진, 공지 이미지 등) 접근 가능
- 해당: `WebMvcConfig.java`

### 15. 에러 처리 일관성 부족
- 일부 컨트롤러: `try/catch` + `System.err.println` + 빈 500 응답
- 전역 `@ControllerAdvice` 에러 핸들러 없음
- 클라이언트에 일관된 에러 형식 미제공
- 해당: `UserReportController.java` 등 다수

### 16. 탈퇴/정지 사용자 행동 미차단
- 로그인 시에만 `WITHDRAW`/`SUSPENDED` 상태 체크
- 이후 API 호출에서는 사용자 상태를 확인하지 않음
- 탈퇴/정지된 사용자가 기존 세션으로 계속 활동 가능
- 해당: 거의 모든 Service 계층
