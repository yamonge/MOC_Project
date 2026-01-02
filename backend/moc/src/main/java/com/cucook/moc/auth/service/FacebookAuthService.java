package com.cucook.moc.auth.service;

import com.cucook.moc.auth.dto.FacebookLoginRequestDTO;
import com.cucook.moc.user.dto.response.LoginResponseDTO;
import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.vo.UserVO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;

/**
 * 페이스북 소셜 로그인 서비스
 * Facebook Graph API를 사용하여 Access Token을 검증하고
 * 사용자 자동 가입/로그인을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FacebookAuthService {

    private final UserDAO userDAO;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String FACEBOOK_GRAPH_API = "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=";

    /**
     * 페이스북 로그인 처리
     * 1. Facebook Graph API로 accessToken 검증
     * 2. 사용자 정보 추출 (email, name, picture)
     * 3. DB 조회 → 없으면 자동 회원가입
     * 4. LoginResponseDTO 반환
     */
    @Transactional
    public LoginResponseDTO facebookLogin(FacebookLoginRequestDTO request) {
        try {
            // 1. Facebook Graph API로 Access Token 검증
            String apiUrl = FACEBOOK_GRAPH_API + request.getAccessToken();
            String response = restTemplate.getForObject(apiUrl, String.class);
            
            if (response == null) {
                throw new RuntimeException("Invalid Facebook access token");
            }

            JsonNode jsonNode = objectMapper.readTree(response);
            String email = jsonNode.has("email") ? jsonNode.get("email").asText() : null;
            String name = jsonNode.has("name") ? jsonNode.get("name").asText() : "Facebook User";
            String picture = jsonNode.has("picture") && jsonNode.get("picture").has("data") 
                    ? jsonNode.get("picture").get("data").get("url").asText() 
                    : null;

            if (email == null) {
                throw new RuntimeException("Facebook 계정에 이메일이 없습니다. 이메일 권한을 허용해주세요.");
            }

            log.info("✅ Facebook 로그인 시도: email={}, name={}", email, name);

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
                newUser.setUserName(name);
                newUser.setUserNickname(generateUniqueNickname(name));
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

                log.info("✅ 페이스북 회원가입 완료: userId={}", newUser.getUserId());

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
            log.error("❌ Facebook 로그인 실패: {}", e.getMessage(), e);
            throw new RuntimeException("Facebook 로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
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
