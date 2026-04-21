# API 키 발급 및 설정 가이드 — MOC Project

> 각 API 키를 어디서 발급받고, 어디에 넣어야 하는지 상세하게 정리한 문서

---

## 0. MySQL 데이터베이스 생성 (Docker 컨테이너)

> MySQL 컨테이너가 이미 실행 중인 상태에서, `moc` 데이터베이스만 생성하면 됨

### Step 1: 실행 중인 MySQL 컨테이너 확인

```bash
docker ps | grep mysql
```

출력 예시:
```
abc123  mysql-container  mysql:8.0  0.0.0.0:3306->3306/tcp
```
여기서 **컨테이너 이름** (예: `mysql-container`) 또는 **컨테이너 ID** (예: `abc123`)를 확인

### Step 2: MySQL 컨테이너에 접속

```bash
# 컨테이너 이름으로 접속 (이름은 본인 환경에 맞게 변경)
docker exec -it 컨테이너_이름_또는_ID mysql -u root -p
```

비밀번호 입력 프롬프트가 나오면 MySQL root 비밀번호 입력

### Step 3: 데이터베이스 + 사용자 생성

```sql
-- 1) moc 데이터베이스 생성
CREATE DATABASE moc
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) 전용 사용자 생성 (권장, root 직접 사용보다 안전)
CREATE USER 'moc_user'@'%' IDENTIFIED BY '원하는_비밀번호';

-- 3) moc 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON moc.* TO 'moc_user'@'%';
FLUSH PRIVILEGES;

-- 4) 확인
SHOW DATABASES;
-- moc이 목록에 보이면 성공

-- 5) 나가기
exit;
```

> **root를 그대로 쓰고 싶으면** 2~3번 건너뛰고, `application.yml`에 root 계정 정보 입력해도 됨

### Step 4: `application.yml`에 반영

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/moc?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: moc_user          # ← Step 3에서 만든 사용자 (또는 root)
    password: 원하는_비밀번호     # ← Step 3에서 설정한 비밀번호
```

### 테이블은?

테이블은 **직접 만들 필요 없음**. `application.yml`에 `ddl-auto: update`로 설정되어 있어서 Spring Boot가 처음 기동할 때 **Entity 기반으로 자동 생성**함.

### Docker 컨테이너가 안 보이면?

```bash
# 중지된 컨테이너 포함 전체 확인
docker ps -a | grep mysql

# 중지된 컨테이너 재시작
docker start 컨테이너_이름_또는_ID

# 컨테이너 자체가 없으면 새로 생성
docker run -d \
  --name mysql-moc \
  -e MYSQL_ROOT_PASSWORD=원하는_root_비밀번호 \
  -p 3306:3306 \
  mysql:8.0
```

---

## 설정 파일 구조

```
백엔드:
  application.yml          ← 개발용 (localhost, 플레이스홀더)
  application-prod.yml     ← 프로덕션용 (환경변수로 주입)

프론트엔드:
  .env                     ← 개발용 (localhost)
  .env.production          ← 프로덕션용 (AWS 도메인)
```

- 개발할 때: `application.yml` + `.env`에 직접 값 입력
- 배포할 때: `application-prod.yml`은 환경변수로 주입, `.env.production`에 값 입력

---

## 1. Google Cloud Console (3개 키)

### 발급 위치
https://console.cloud.google.com/

### 1-1. Gemini AI API Key

1. Google Cloud Console 접속
2. 좌측 메뉴 → **API 및 서비스** → **라이브러리**
3. "Generative Language API" 또는 "Gemini API" 검색 → **사용 설정**
4. 좌측 메뉴 → **API 및 서비스** → **사용자 인증 정보**
5. **+ 사용자 인증 정보 만들기** → **API 키** 클릭
6. 생성된 키 복사

> 또는 https://aistudio.google.com/apikey 에서 바로 발급 가능 (더 간편)

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `application.yml` | `gemini.api.key: 여기에_입력` |
| AWS 환경변수 | `GEMINI_API_KEY=여기에_입력` |

---

### 1-2. YouTube Data API v3 Key

1. Google Cloud Console → **API 및 서비스** → **라이브러리**
2. "YouTube Data API v3" 검색 → **사용 설정**
3. **API 및 서비스** → **사용자 인증 정보** → **+ API 키** 생성
4. (권장) 키 제한: **API 제한** → YouTube Data API v3만 허용

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `application.yml` | `youtube.api.key: 여기에_입력` |
| AWS 환경변수 | `YOUTUBE_API_KEY=여기에_입력` |

---

### 1-3. Google OAuth Client ID (소셜 로그인)

1. Google Cloud Console → **API 및 서비스** → **OAuth 동의 화면**
2. 동의 화면이 없으면 먼저 생성 (앱 이름, 이메일 등 입력)
3. **사용자 인증 정보** → **+ OAuth 클라이언트 ID 만들기**
4. 애플리케이션 유형:
   - **웹 애플리케이션**: `webClientId`로 사용 (프론트엔드 + 백엔드 공용)
   - **Android**: 패키지명 + SHA-1 지문 입력 (안드로이드 앱 전용)
   - **iOS**: 번들 ID 입력 (iOS 앱 전용)
5. **웹 클라이언트 ID** 복사 (형식: `xxxxxxx.apps.googleusercontent.com`)

> **주의**: 프론트엔드에서 쓰는 `GOOGLE_WEB_CLIENT_ID`는 반드시 **"웹 애플리케이션"** 유형이어야 함

**SHA-1 지문 확인 방법 (Android):**
```bash
# 디버그 키
cd frontend/moc/android
./gradlew signingReport
# 출력에서 SHA1 값 복사
```

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `.env` | `GOOGLE_WEB_CLIENT_ID=xxxxxxx.apps.googleusercontent.com` |
| `.env.production` | `GOOGLE_WEB_CLIENT_ID=xxxxxxx.apps.googleusercontent.com` |

---

## 2. OpenAI API Key (Whisper 음성 인식)

### 발급 위치
https://platform.openai.com/

1. OpenAI 계정 로그인
2. 좌측 메뉴 → **API Keys** (또는 https://platform.openai.com/api-keys)
3. **+ Create new secret key** 클릭
4. 이름 입력 → **Create secret key**
5. 키 복사 (형식: `sk-xxxxxxxxxxxxxxxx`)

> **주의**: 키는 생성 직후에만 볼 수 있음. 놓치면 재발급 필요.
> **비용**: Whisper API는 유료. 분당 약 $0.006. 결제 수단 등록 필요.

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `application.yml` | `openai.api.key: sk-여기에_입력` |
| AWS 환경변수 | `OPENAI_API_KEY=sk-여기에_입력` |

---

## 3. Naver API (2쌍 = 4개 키)

### 3-1. Naver Search API (장소 검색)

#### 발급 위치
https://developers.naver.com/

1. 네이버 개발자 센터 로그인
2. **Application** → **애플리케이션 등록**
3. 애플리케이션 이름 입력
4. **사용 API**: "검색" 체크
5. **비로그인 오픈 API 서비스 환경**: 서버에서 쓰므로 **WEB 설정** → 서비스 URL 입력 (개발: `http://localhost:8090`)
6. 등록 후 **Client ID**와 **Client Secret** 복사

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `application.yml` | `naver.search.client-id: 여기` / `naver.search.client-secret: 여기` |
| AWS 환경변수 | `NAVER_SEARCH_CLIENT_ID` / `NAVER_SEARCH_CLIENT_SECRET` |

---

### 3-2. Naver Cloud Platform (지도 SDK)

#### 발급 위치
https://console.ncloud.com/

1. 네이버 클라우드 플랫폼 가입/로그인
2. 콘솔 → **서비스** → **AI·NAVER API** → **Maps**
3. **Application 등록** → 이름 입력
4. **Maps** 중 사용할 API 선택:
   - Mobile Dynamic Map (React Native에서 사용)
5. **Android 패키지명** 입력 (예: `com.moc`)
6. **iOS Bundle ID** 입력 (예: `com.cucook.moc`)
7. 등록 후 **Client ID** (= `NMFClientId`) 복사

**넣는 곳:**
| 파일 | 위치 | 용도 |
|------|------|------|
| `application.yml` | `naver.cloud.client-id` / `naver.cloud.client-secret` | 백엔드 Reverse Geocoding 등 |
| `AndroidManifest.xml` | `<meta-data android:name="com.naver.maps.map.CLIENT_ID" android:value="여기"/>` | Android 지도 |
| `Info.plist` | `NMFClientId` → `여기` | iOS 지도 |
| AWS 환경변수 | `NAVER_CLOUD_CLIENT_ID` / `NAVER_CLOUD_CLIENT_SECRET` | 프로덕션 백엔드 |

> **주의**: Naver **Search API**(developers.naver.com)와 **Cloud Platform**(console.ncloud.com)은 **별도 계정/별도 키**임

---

## 4. Firebase (FCM 푸시 알림)

### 발급 위치
https://console.firebase.google.com/

1. Firebase Console → **프로젝트 만들기** (또는 기존 프로젝트)
2. **프로젝트 설정** (⚙️ 아이콘)

### 4-1. Android 설정
1. **일반** 탭 → **앱 추가** → **Android**
2. 패키지명: `com.moc` (AndroidManifest.xml과 동일)
3. SHA-1 지문 입력 (위 Google OAuth에서 확인한 것과 동일)
4. **`google-services.json`** 다운로드
5. 파일을 `frontend/moc/android/app/` 폴더에 넣기

### 4-2. iOS 설정
1. **앱 추가** → **iOS**
2. 번들 ID: `com.cucook.moc`
3. **`GoogleService-Info.plist`** 다운로드
4. Xcode에서 프로젝트에 추가 (macOS 필요)

### 4-3. 백엔드 서비스 계정 (서버에서 푸시 발송용)
1. **프로젝트 설정** → **서비스 계정** 탭
2. **Firebase Admin SDK** → **새 비공개 키 생성** 클릭
3. JSON 파일 다운로드 (형식: `firebase-service-account.json`)
4. 파일 배치:
   - 개발: `backend/moc/src/main/resources/firebase-service-account.json`
   - 프로덕션: 서버에 별도 경로 배치 후 환경변수로 지정

**넣는 곳:**
| 파일/위치 | 내용 |
|-----------|------|
| `frontend/moc/android/app/google-services.json` | Firebase Android 설정 파일 |
| `frontend/moc/ios/moc/GoogleService-Info.plist` | Firebase iOS 설정 파일 (macOS) |
| `backend/.../resources/firebase-service-account.json` | 서버 푸시 발송용 (개발) |
| AWS 환경변수 `FIREBASE_CONFIG_PATH` | 서버의 JSON 파일 절대경로 (프로덕션) |

---

## 5. Facebook SDK (소셜 로그인)

### 발급 위치
https://developers.facebook.com/

1. Meta for Developers 로그인
2. **My Apps** → **앱 만들기**
3. 앱 유형: **소비자** 또는 **비즈니스**
4. 앱 이름, 연락처 이메일 입력
5. 앱 대시보드에서 **설정** → **기본**
6. **앱 ID** 와 **앱 시크릿** 복사
7. 좌측 **Facebook 로그인** → **설정** → 유효한 OAuth 리다이렉션 URI 추가

**넣는 곳:**
| 파일 | 키 | 값 |
|------|-----|-----|
| `Info.plist` | `FacebookAppID` | 앱 ID (숫자) |
| `Info.plist` | `FacebookClientToken` | **설정 → 고급 → 클라이언트 토큰** |
| `Info.plist` | `FacebookDisplayName` | 앱 이름 |
| `AndroidManifest.xml` | `com.facebook.sdk.ApplicationId` | 앱 ID |
| `android/app/src/main/res/values/strings.xml` | `facebook_app_id` | 앱 ID |

---

## 6. JWT Secret (직접 생성)

외부 서비스 아님. 직접 랜덤 문자열을 만들면 됨.

```bash
# 터미널에서 256bit 랜덤 키 생성
openssl rand -base64 32
# 예시 출력: K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

**넣는 곳:**
| 파일 | 위치 |
|------|------|
| `application.yml` | `jwt.secret: 생성한_키` (개발용) |
| AWS 환경변수 | `JWT_SECRET=생성한_키` (프로덕션, 더 긴 키 권장) |

---

## 요약: 전체 키 목록 + 어디에 넣나

### 백엔드 (`application.yml` 직접 입력)

```yaml
gemini:
  api:
    key: AIza...                    # Google AI Studio에서 발급

openai:
  api:
    key: sk-...                     # OpenAI 대시보드에서 발급

youtube:
  api:
    key: AIza...                    # Google Cloud Console에서 발급

naver:
  search:
    client-id: XXXXXX              # developers.naver.com에서 발급
    client-secret: XXXXXX
  cloud:
    client-id: XXXXXX              # console.ncloud.com에서 발급
    client-secret: XXXXXX

jwt:
  secret: K7gNU3sdo+OL0...         # openssl rand -base64 32 로 생성

spring:
  datasource:
    username: 실제_DB_사용자
    password: 실제_DB_비밀번호
  mail:
    username: 실제_이메일@gmail.com
    password: 앱_비밀번호             # Gmail → 2단계 인증 → 앱 비밀번호
```

### 프론트엔드 (`.env` 직접 입력)

```
SERVER_IP=localhost:8090
SERVER_BASE_URL=https://localhost:8090
GOOGLE_WEB_CLIENT_ID=xxxxxxx.apps.googleusercontent.com
```

### 파일로 넣는 것

```
frontend/moc/android/app/google-services.json       ← Firebase Console
backend/.../resources/firebase-service-account.json  ← Firebase 서비스 계정
```

---

## Gmail 앱 비밀번호 발급 (메일 발송용)

1. https://myaccount.google.com/security 접속
2. **2단계 인증** 활성화 (필수)
3. 2단계 인증 설정 페이지 하단 → **앱 비밀번호**
4. 앱 선택: "메일", 기기 선택: "기타" → 이름 입력
5. **생성** → 16자리 비밀번호 복사
6. `application.yml`의 `spring.mail.password`에 입력

---

## 프로덕션 배포 시 (AWS)

**위 키들을 `application.yml`에 직접 넣지 말고**, AWS Secrets Manager 또는 EC2 환경변수로 주입:

```bash
# EC2에서 실행 예시
export DB_HOST=moc-db.xxxxxx.ap-northeast-2.rds.amazonaws.com
export DB_USERNAME=admin
export DB_PASSWORD=xxxxx
export JWT_SECRET=xxxxx
export GEMINI_API_KEY=AIza...
export OPENAI_API_KEY=sk-...
# ... 나머지 키들 ...

java -jar moc.jar --spring.profiles.active=prod
```

`application-prod.yml`이 `${변수명}` 패턴으로 이 환경변수들을 자동으로 읽음.
