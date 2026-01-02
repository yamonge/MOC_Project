package com.cucook.moc.auth.service;

import com.cucook.moc.auth.dto.GoogleLoginRequestDTO;
import com.cucook.moc.user.dto.response.LoginResponseDTO;
import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.vo.UserVO;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Collections;

/**
 * 구글 소셜 로그인 서비스
 * Google API Client 라이브러리를 사용하여 Google ID Token을 검증하고
 * 사용자 자동 가입/로그인을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserDAO userDAO;
    
    private static final String WEB_CLIENT_ID = "1081675491060-ao6tarullgvoga5n4o2pp33ic7c710di.apps.googleusercontent.com";

    /**
     * 구글 로그인 처리
     * 1. Firebase로 idToken 검증
     * 2. 사용자 정보 추출 (email, name, picture)
     * 3. DB 조회 → 없으면 자동 회원가입
     * 4. LoginResponseDTO 반환
     */
    @Transactional
    public LoginResponseDTO googleLogin(GoogleLoginRequestDTO request) {
        try {
            // 1. Google API Client로 ID Token 검증
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(WEB_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            
            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            log.info("✅ Google 로그인 시도: email={}, name={}", email, name);

            // 2. 이메일로 기존 회원 조회
            UserVO existingUser = userDAO.findByUserEmail(email);

            if (existingUser != null) {
                // 기존 회원 → 로그인 처리
                log.info("✅ 기존 회원 로그인: userId={}", existingUser.getUserId());
                
                // FCM 토큰 업데이트
                if (request.getFcmToken() != null) {
                    userDAO.updateFcmToken(
                            existingUser.getUserId(),
                            request.getFcmToken(),
                            request.getDeviceOs(),
                            request.getDeviceVersion()
                    );
                }
                
                // 마지막 로그인 시간 갱신
                userDAO.updateLastLoginDate(existingUser.getUserId());

                return LoginResponseDTO.builder()
                        .userId(existingUser.getUserId())
                        .userEmail(existingUser.getUserEmail())
                        .userName(existingUser.getUserName())
                        .userNickname(existingUser.getUserNickname())
                        .userType(existingUser.getUserType())
                        .userStatus(existingUser.getUserStatus())
                        .build();
            } else {
                // 신규 회원 → 자동 회원가입
                log.info("✅ 신규 회원 자동 가입: email={}", email);
                
                UserVO newUser = new UserVO();
                newUser.setUserEmail(email);
                newUser.setUserName(name != null ? name : "Google User");
                newUser.setUserNickname(generateUniqueNickname(name != null ? name : "GoogleUser"));
                newUser.setUserPassword(null); // 소셜 로그인은 비밀번호 없음
                newUser.setUserProfileImageUrl(picture);
                newUser.setUserType("N"); // 일반 사용자
                newUser.setUserStatus("ACTIVE");
                newUser.setReportedCnt(0);
                newUser.setShoppingCompletedCnt(0);
                newUser.setRatingScore(0.0);
                newUser.setTrustScore(100.0);
                newUser.setFcmToken(request.getFcmToken());
                newUser.setDeviceOs(request.getDeviceOs());
                newUser.setDeviceVersion(request.getDeviceVersion());
                newUser.setCreatedDate(new Timestamp(System.currentTimeMillis()));

                // DB에 저장
                userDAO.insertUser(newUser);

                log.info("✅ 구글 회원가입 완료: userId={}", newUser.getUserId());

                return LoginResponseDTO.builder()
                        .userId(newUser.getUserId())
                        .userEmail(newUser.getUserEmail())
                        .userName(newUser.getUserName())
                        .userNickname(newUser.getUserNickname())
                        .userType(newUser.getUserType())
                        .userStatus(newUser.getUserStatus())
                        .build();
            }

        } catch (Exception e) {
            log.error("❌ Google 로그인 실패: {}", e.getMessage(), e);
            throw new RuntimeException("Google 로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 중복되지 않는 닉네임 생성
     * - 기본: 이름 + 랜덤 숫자
     * - 중복 시: 숫자 증가
     */
    private String generateUniqueNickname(String baseName) {
        String nickname = baseName;
        int suffix = 1;

        while (userDAO.countByNickname(nickname) > 0) {
            nickname = baseName + suffix;
            suffix++;
        }

        return nickname;
    }
}
