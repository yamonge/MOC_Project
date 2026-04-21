# AWS 배포 + 실기기 앱 설치 관점 전체 프로젝트 재분석 — 2026-04-21

> **전제**: 백엔드는 AWS(EC2/ECS)에 배포, 프론트엔드(React Native)는 실제 폰에 APK/IPA로 설치  
> ngrok은 더 이상 사용하지 않으며, HTTPS 도메인(예: `https://api.myownchef.com`)을 사용한다고 가정

---

## 1. 백엔드 — `application.yml` 환경 분리 필수

### 1-1. 현재 문제점

| 항목 | 현재 값 | 문제 | 수정 방향 |
|------|---------|------|-----------|
| `server.base-url` | `http://localhost:8090` | 이미지 URL이 `localhost`로 생성됨 → 폰에서 로딩 불가 | `https://api.myownchef.com` (환경변수) |
| `datasource.url` | `localhost:3306` | AWS에서 RDS 호스트 필요 | `${DB_HOST:localhost}` 패턴 |
| `datasource.username/password` | `YOUR_DB_*` 플레이스홀더 | 하드코딩 위험 | 환경변수 / AWS Secrets Manager |
| `jpa.ddl-auto` | `update` | 프로덕션에서 자동 스키마 변경 위험 | `validate` 또는 `none` + Flyway |
| `show-sql` / `format_sql` | `true` | 성능 저하 + 로그 노출 | 프로덕션에서 `false` |
| `jwt.secret` | `CHANGE_ME...` 폴백 | 환경변수 미설정시 약한 키로 가동 | 폴백 제거, 미설정시 기동 실패 권장 |
| `mail` | Gmail SMTP | 소규모 OK, 대량은 SES 권장 | AWS SES 또는 환경변수화 |
| `file.upload.dir` | `uploads` (상대경로) | EC2 CWD 의존, ECS 재배포시 파일 소실 | S3 또는 EFS + 절대경로 |
| `app.frontend-base-url` | `http://localhost:3000` | 비밀번호 재설정 메일 링크가 localhost | 프로덕션 URL 또는 딥링크 |
| 외부 API 키 (6개) | `YOUR_*` 플레이스홀더 | 깃에 올리면 유출 | 환경변수 / Secrets Manager |

### 1-2. 권장 — `application-prod.yml` 프로필 분리

```yaml
# application-prod.yml (예시)
server:
  base-url: ${SERVER_BASE_URL}

spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT:3306}/moc?useSSL=true&serverTimezone=Asia/Seoul
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: false

jwt:
  secret: ${JWT_SECRET}

file:
  upload:
    dir: /var/app/uploads    # 절대경로 (또는 S3 마이그레이션)

app:
  frontend-base-url: ${FRONTEND_BASE_URL}
```

---

## 2. 백엔드 — `server.base-url` 사용처 (이미지 URL 생성)

> **핵심 이슈**: 백엔드가 `server.base-url`을 이미지 경로 앞에 붙여 절대 URL을 만든다.  
> `localhost`면 폰에서 이미지가 깨진다.

| 파일 | 사용 방식 |
|------|-----------|
| `RecipeBoardServiceImpl.java` (31행) | 썸네일·프로필 이미지에 `serverBaseUrl + "/uploads/..."` |
| `NoticeServiceImpl.java` (25행) | 공지사항 이미지에 `serverBaseUrl + imageUrl` |
| `ShoppingChatRoomController.java` (28행) | 채팅방 프로필에 `serverBaseUrl + profileImageUrl` |
| `UserServiceImpl.java` (50행) | 유저 프로필·리뷰에 `serverBaseUrl + profileImageUrl` |
| `UserReviewServiceImpl.java` (30행) | 리뷰 작성자 프로필에 `serverBaseUrl + profileImageUrl` |
| **`RecipeImageResolver.java` (9행)** | **⚠️ 하드코딩** `"http://localhost:8090/image/"` — `@Value` 미사용 |
| `FileUploadUtil.java` (29행) | 주입만 되고 미사용 (데드코드) |

### RecipeImageResolver.java — 즉시 수정 필요

```java
// 현재 (하드코딩)
private static final String BASE_URL = "http://localhost:8090/image/";

// 수정 필요 → @Value 주입
@Value("${server.base-url:http://localhost:8090}")
private String serverBaseUrl;

public String resolveByCategory(String category) {
    String baseUrl = serverBaseUrl + "/image/";
    // ...
}
```

---

## 3. 백엔드 — 파일 업로드/제공 (S3 마이그레이션 검토)

### 현재 구조
```
업로드: FileUploadUtil → 로컬 디스크 (uploads/profile/, uploads/notice/)
제공:   WebMvcConfig → /uploads/** 정적 리소스 핸들러
                     → /image/** classpath:/static/image/ (카테고리 아이콘)
```

### AWS 배포시 문제점
1. **EC2 단일 인스턴스**: 로컬 디스크 OK, 단 재배포/AMI 교체시 파일 소실
2. **ECS/다중 인스턴스**: 로컬 디스크 공유 불가 → **S3 + CloudFront** 필수
3. **현재 `/uploads/` 경로 패턴이 코드 전체에 산재** → S3 전환시 대규모 리팩토링 필요

### 권장 (단계별)
- **Phase 1 (EC2 단일)**: `/var/app/uploads` 절대경로 + `application-prod.yml` → 당장 동작
- **Phase 2 (스케일)**: S3 업로드 + CloudFront CDN → FileUploadUtil 리팩토링

---

## 4. 백엔드 — CORS / WebSocket

| 파일 | 현재 설정 | 프로덕션 영향 |
|------|-----------|--------------|
| `SecurityConfig.java` (74행) | `allowedOriginPatterns("*")` + `allowCredentials(true)` | RN 네이티브 HTTP는 CORS 무관, 그러나 **과도하게 개방적** |
| `WebSocketConfig.java` (25행) | `setAllowedOriginPatterns("*")` | WebSocket도 모든 Origin 허용 |

> **RN 앱은 브라우저가 아니므로 CORS가 직접 적용되지 않는다.**  
> 다만 WebView를 쓰거나 웹 관리자 페이지가 있으면 Origin 제한 필요.  
> 현재는 앱 전용이므로 큰 문제는 아니지만, 추후 관리자 웹을 만들 때 제한 추가 권장.

---

## 5. 프론트엔드 — `.env` + URL 구조

### 5-1. 현재 `.env`

```
SERVER_IP=localhost:8090
SERVER_BASE_URL=https://localhost:8090
GOOGLE_WEB_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

### 5-2. 프로덕션용 `.env.production` 필요

```
SERVER_IP=api.myownchef.com
SERVER_BASE_URL=https://api.myownchef.com
GOOGLE_WEB_CLIENT_ID=실제_클라이언트_ID
```

### 5-3. URL 흐름 정리

```
.env → axiosConfig.js (SERVER_BASE_URL export)
         ↓
    ┌────┴─────────────┐
    │                   │
  api/*.js          StompClient.js
  (REST API)        (WebSocket)
  BASE_URL/api/*    SERVER_BASE_URL/ws-chat
    │
    └─→ imageUrlHelper.js
         (localhost URL → SERVER_BASE_URL 치환)
```

---

## 6. 프론트엔드 — `imageUrlHelper.js` 역할 재정의

### 현재 동작
- 백엔드가 `http://localhost:8090/uploads/...` 이미지 URL 반환
- `imageUrlHelper.js`가 `localhost:8090` → `SERVER_BASE_URL`로 치환

### AWS 배포 후 시나리오

**Case A — 백엔드 `server.base-url`을 정확히 설정한 경우:**
- 백엔드가 `https://api.myownchef.com/uploads/...` 반환
- `imageUrlHelper.js`의 `localhost` 치환 조건 불일치 → **그냥 통과 (정상)**
- ✅ `imageUrlHelper.js`는 사실상 불필요해짐 (안전장치로 남겨도 무해)

**Case B — 백엔드 설정 실수로 localhost가 섞인 경우:**
- `imageUrlHelper.js`가 보정해줌 → **안전장치 역할**

### 결론
> AWS 배포 후 `server.base-url`만 정확히 설정하면 `imageUrlHelper.js`는 자동으로 불필요해짐.  
> 제거하지 않아도 되며, JSDoc 주석만 "개발 환경 폴백용"으로 갱신하면 충분.

---

## 7. 프론트엔드 — `auth.js` deviceOs 하드코딩

```javascript
// auth.js 144-145행, 179-180행
deviceOs: 'Android',
deviceVersion: '',
```

> iOS 기기에서 실행하면 OS 정보가 **항상 'Android'로 전송**됨.  
> 백엔드에서 이 필드를 로깅·통계·푸시 분기 등에 사용하면 **프로덕션 버그**.

### 수정 필요

```javascript
import { Platform } from 'react-native';
// ...
deviceOs: Platform.OS === 'ios' ? 'iOS' : 'Android',
deviceVersion: Platform.Version?.toString() || '',
```

---

## 8. 프론트엔드 — 프로덕션 console.log 잔존

`babel-plugin-transform-remove-console` 적용 완료이지만 **프로덕션 빌드에서만 동작**.

### 여전히 민감한 로그가 있는 파일들 (비프로덕션/디버그 빌드 노출)
| 파일 | 내용 |
|------|------|
| `StompClient.js` (60행 등 20+곳) | WebSocket 연결·메시지 로그 (`__DEV__` 없이) |
| `chatStore.js` (57행 등 15+곳) | 채팅 상태 변경 로그 (`__DEV__` 없이) |
| `notificationService.js` (187행) | **FCM 토큰 전체를 console.log** |
| `auth.js` (161행) | 로그인 에러 상세 |

> babel 플러그인으로 프로덕션에서 제거되지만, **디버그 APK/테스트 빌드에서는 여전히 노출**.  
> 민감 정보(FCM 토큰 등)는 `__DEV__` 가드를 명시적으로 추가하는 것을 권장.

---

## 9. 백엔드 — 비밀번호 재설정 메일 (MailServiceImpl)

```java
// MailServiceImpl.java
@Value("${app.frontend-base-url}")
private String frontendBaseUrl;  // 현재: http://localhost:3000
```

> 비밀번호 재설정 링크가 `http://localhost:3000/...`으로 생성됨.  
> **앱만 있고 웹이 없으므로** 딥링크(Deep Link) 또는 앱 내 처리로 전환 필요.  
> 또는 비밀번호 재설정을 앱 내 OTP/코드 방식으로 변경.

---

## 10. 백엔드 — build.gradle 배포 관련

| 항목 | 현재 | 권장 |
|------|------|------|
| Spring Boot 버전 | `3.5.9-SNAPSHOT` | 정식 릴리스 버전 (재현성) |
| WAR 플러그인 | `id 'war'` + `providedRuntime tomcat` | EC2에 JAR 실행이면 WAR 불필요 |
| Actuator | 의존성 있음 | `/actuator/health`만 열고 나머지 보안 처리 |

---

## 11. 인프라 아키텍처 권장안

```
[사용자 폰 (RN App)]
       │
       │ HTTPS
       ▼
[AWS ALB / API Gateway]  ← SSL 인증서 (ACM)
       │
       ├─ REST API ──→ [EC2 / ECS] ← Spring Boot (JAR)
       │                     │
       │                     ├─ MySQL ──→ [RDS]
       │                     ├─ 파일 ──→ [S3 + CloudFront]
       │                     └─ 시크릿 ──→ [Secrets Manager / SSM Parameter Store]
       │
       └─ WebSocket ──→ [EC2 / ECS] ← SockJS/STOMP (스티키 세션 필요)

[Firebase Cloud Messaging] ← 푸시 알림
[Google/Facebook/Naver] ← 소셜 로그인 + API
```

---

## 수정 우선순위 체크리스트

### 🔴 즉시 수정 (AWS 배포 전 필수) — 모두 완료

- [x] `application-prod.yml` 프로필 파일 생성 (환경변수 기반)
- [x] `RecipeImageResolver.java` — 하드코딩 `localhost:8090` → `@Value` 주입
- [x] `.env.production` 파일 생성 (프론트엔드)
- [x] `auth.js` — `deviceOs: 'Android'` 하드코딩 → `Platform.OS` 동적 감지
- [x] `file.upload.dir` — prod에서 절대경로(`/var/app/uploads`) 사용

### 🟡 코드 수정 — 모두 완료

- [x] `jwt.secret` 폴백값 정리 (prod에서는 환경변수 필수, 폴백 없음)
- [x] `jpa.ddl-auto: validate` + `show-sql: false` (application-prod.yml에 적용)
- [x] `imageUrlHelper.js` — JSDoc 주석 갱신 (ngrok → 개발환경 폴백용으로 재정의)
- [x] `StompClient.js` / `notificationService.js` / `chatStore.js` — 전체 console.log에 `__DEV__` 가드 추가
- [x] `build.gradle` — `3.5.9-SNAPSHOT` → `3.5.13` 정식 릴리스 + snapshot 저장소 제거

### 🟠 첫 배포 전 필수 — AWS 계정/인프라 확보 후 진행

> 코드만으로는 불가. AWS 계정, 도메인, 인프라 세팅이 선행되어야 작업 가능.

- [ ] 파일 업로드 S3 마이그레이션 + CloudFront CDN (S3 버킷 생성 후 SDK 연동 코드 작성)
- [ ] CORS Origin 제한 (최종 도메인 확정 후 SecurityConfig에 적용)
- [ ] WebSocket 스티키 세션 / ALB 설정 (AWS 콘솔 인프라 작업)
- [ ] Actuator 엔드포인트 보안 설정 (application-prod.yml에 추가)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions → ECR → ECS)
- [ ] 모니터링 설정 (CloudWatch, Actuator health endpoint)
- [ ] `MailServiceImpl` — 딥링크 또는 앱 내 비밀번호 재설정 방식 전환 (앱 URL scheme 설계 필요)

---

## 부록: 전체 환경변수 목록 (프로덕션 필요)

### 백엔드 (application-prod.yml 또는 환경변수)
| 변수명 | 설명 |
|--------|------|
| `SERVER_BASE_URL` | 공개 API URL (`https://api.myownchef.com`) |
| `DB_HOST` | RDS 엔드포인트 |
| `DB_PORT` | RDS 포트 (기본 3306) |
| `DB_USERNAME` | DB 사용자 |
| `DB_PASSWORD` | DB 비밀번호 |
| `JWT_SECRET` | JWT 서명 키 (256bit+) |
| `FIREBASE_CONFIG_PATH` | Firebase 서비스 계정 JSON 경로 |
| `FRONTEND_BASE_URL` | 딥링크/웹 URL |
| `GEMINI_API_KEY` | Google Gemini AI |
| `OPENAI_API_KEY` | OpenAI Whisper |
| `YOUTUBE_API_KEY` | YouTube Data API |
| `NAVER_SEARCH_CLIENT_ID` | 네이버 검색 API |
| `NAVER_SEARCH_CLIENT_SECRET` | 네이버 검색 API |
| `NAVER_CLOUD_CLIENT_ID` | 네이버 클라우드 |
| `NAVER_CLOUD_CLIENT_SECRET` | 네이버 클라우드 |
| `MAIL_USERNAME` | 메일 발신 계정 |
| `MAIL_PASSWORD` | 메일 앱 비밀번호 |

### 프론트엔드 (.env.production)
| 변수명 | 설명 |
|--------|------|
| `SERVER_IP` | API 서버 도메인 (`api.myownchef.com`) |
| `SERVER_BASE_URL` | 전체 URL (`https://api.myownchef.com`) |
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth 클라이언트 ID |
