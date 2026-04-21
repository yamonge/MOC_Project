package com.cucook.moc.user.service;

import java.security.SecureRandom;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.util.List;

import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.common.EmailMaskingUtil;
import com.cucook.moc.security.JwtTokenProvider;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.user.dao.PasswordResetTokenRepository;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.dao.UserReviewRepository;
import com.cucook.moc.user.dto.PublicProfileDTO;
import com.cucook.moc.user.dto.UserProfileDTO;
import com.cucook.moc.user.dto.UserReviewDTO;
import com.cucook.moc.user.dto.request.*;
import com.cucook.moc.user.vo.PasswordResetTokenVO;
import com.cucook.moc.user.vo.UserReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cucook.moc.user.dto.response.*;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.MailService;
import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserReviewRepository userReviewRepository;
    private final ShoppingPostDAO shoppingPostDAO;
    private final ChatParticipantDAO chatParticipantDAO;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;
    
    @Override
    public CheckAdminResponseDTO checkAdmin(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "USER_ID_REQUIRED");
        }

        UserVO user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
        }

        String userType = user.getUserType();
        String status = user.getUserStatus();

        boolean isAdmin = "Y".equalsIgnoreCase(userType) && !"WITHDRAW".equalsIgnoreCase(status);

        return new CheckAdminResponseDTO(isAdmin, userType, status);
    }

    @Override
    public boolean isDuplicateEmail(String userEmail) {
        return userRepository.existsByUserEmail(userEmail);
    }

    @Override
    public void signup(SignupRequestDTO request) {

        if (!request.getUserPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        if (isDuplicateEmail(request.getUserEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        UserVO user = UserVO.builder()
                .userEmail(request.getUserEmail())
                .userName(request.getUserName())
                .userNickname(request.getUserNickname())
                .userBirthDate(request.getUserBirthDate())
                .userPassword(passwordEncoder.encode(request.getUserPassword()))
                .fcmToken(request.getFcmToken())
                .userType("N")
                .userStatus("ACTIVE")
                .reportedCnt(0)
                .shoppingCompletedCnt(0)
                .ratingScore(0.0)
                .trustScore(0.0)
                .createdDate(new Timestamp(System.currentTimeMillis()))
                .build();

        userRepository.save(user);
    }

    @Override
    public boolean isNicknameAvailable(String userNickname) {
        return !userRepository.existsByUserNickname(userNickname);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        UserVO user = userRepository.findByUserEmail(request.getUserEmail());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        if (!passwordEncoder.matches(request.getUserPassword(), user.getUserPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        if ("WITHDRAW".equalsIgnoreCase(user.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.GONE, "탈퇴한 계정입니다.");
        }

        if ("SUSPENDED".equalsIgnoreCase(user.getUserStatus())) {

            java.sql.Timestamp suspendedUntil = user.getSuspendedUntil();

            if (suspendedUntil == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다. (영구정지)");
            }

            java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

            if (!now.before(suspendedUntil)) {
                int restored = userRepository.restoreExpiredSuspensionToActive(user.getUserId());
                user = userRepository.findByUserEmail(request.getUserEmail());

                if (user == null) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 처리 중 오류가 발생했습니다.");
                }

                if ("SUSPENDED".equalsIgnoreCase(user.getUserStatus())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다.");
                }
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다.");
            }
        }

        userRepository.updateLastLoginDate(user.getUserId());

        if (request.getFcmToken() != null && !request.getFcmToken().isEmpty()) {
            userRepository.updateFcmToken(
                    user.getUserId(),
                    request.getFcmToken(),
                    null,
                    null
            );
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId(), user.getUserType());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId(), user.getUserType());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setUserId(user.getUserId());
        response.setUserEmail(user.getUserEmail());
        response.setUserName(user.getUserName());
        response.setUserNickname(user.getUserNickname());
        response.setUserType(user.getUserType());
        response.setUserStatus(user.getUserStatus());
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        return response;
    }

    @Override
    public FindEmailResponseDTO findLoginId(FindEmailRequestDTO request) {

        UserVO user = userRepository.findByNameAndBirthDate(
                request.getUserName(),
                request.getUserBirthDate()
        );

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "일치하는 사용자가 없습니다.");
        }

        String maskedEmail = EmailMaskingUtil.maskEmail(user.getUserEmail());

        FindEmailResponseDTO response = new FindEmailResponseDTO();
        response.setUserEmail(maskedEmail);
        return response;
    }


    @Override
    public void sendPasswordResetLink(FindPasswordRequestDTO request) {

        UserVO user = userRepository.findForPasswordReset(
                request.getUserEmail(),
                request.getUserName(),
                request.getUserBirthDate()
        );

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "일치하는 사용자가 없습니다.");
        }

        String resetToken = createResetToken();

        String hashedToken = hashToken(resetToken);
        long now = System.currentTimeMillis();

        PasswordResetTokenVO tokenVO = new PasswordResetTokenVO();
        tokenVO.setUserId(user.getUserId());
        tokenVO.setResetToken(hashedToken);
        long expireMillis = now + Duration.ofHours(1).toMillis();
        tokenVO.setExpireDate(new Timestamp(expireMillis));
        tokenVO.setCreatedDate(new Timestamp(now));
        tokenVO.setUsedYn("N");

        passwordResetTokenRepository.save(tokenVO);

        String resetUrl = buildResetUrl(resetToken);

        mailService.sendPasswordResetLinkMail(user.getUserEmail(), resetUrl);
    }


    private String createResetToken() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(50);
        for (int i = 0; i < 50; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    /**
     * 비밀번호 재설정 토큰을 해시(SHA-256)로 변환
     * - 원본 토큰은 이메일 링크에 사용
     * - DB에는 해시값만 저장해서 보안 강화
     */
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(token.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : encoded) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("토큰 해시 처리 중 오류가 발생했습니다.", e);
        }
    }


    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    private String buildResetUrl(String resetToken) {
        return frontendBaseUrl + "/reset-password?token=" + resetToken;
    }

    @Transactional
    @Override
    public void resetPasswordByToken(ResetPasswordConfirmRequestDTO request) {

        if (request.getToken() == null || request.getToken().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "토큰이 없습니다.");
        }
        if (request.getNewPassword() == null || request.getNewPasswordConfirm() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호를 입력해주세요.");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        String hashedToken = hashToken(request.getToken());
        PasswordResetTokenVO tokenVO = passwordResetTokenRepository.findByResetToken(hashedToken);

        if (tokenVO == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "유효하지 않은 토큰입니다.");
        }

        if ("Y".equalsIgnoreCase(tokenVO.getUsedYn())) {
            throw new ResponseStatusException(HttpStatus.GONE, "이미 사용된 토큰입니다.");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (tokenVO.getExpireDate() == null || tokenVO.getExpireDate().before(now)) {
            throw new ResponseStatusException(HttpStatus.GONE, "만료된 토큰입니다.");
        }

        String encoded = passwordEncoder.encode(request.getNewPassword());
        userRepository.updatePassword(tokenVO.getUserId(), encoded);

        passwordResetTokenRepository.markTokenUsed(tokenVO.getResetTokenId());
    }

    @Override
    public void updateFcmToken(UpdateFcmTokenRequestDTO request) {

        if (request.getUserId() == null || request.getFcmToken() == null) {
            throw new IllegalArgumentException("userId와 fcmToken은 필수입니다.");
        }

        userRepository.updateFcmToken(
                request.getUserId(),
                request.getFcmToken(),
                request.getDeviceOs(),
                request.getDeviceVersion()
        );
    }
    
    @Transactional(readOnly = true)
    public UserProfileDTO getMyProfile(Long userId) {
        UserVO user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setUserEmail(user.getUserEmail());
        dto.setUserNickname(user.getUserNickname());
        dto.setUserProfileImageUrl(user.getUserProfileImageUrl());
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public PublicProfileDTO getPublicProfile(Long targetUserId) {

        UserVO user = userRepository.findById(targetUserId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        Integer completed = userRepository.countCompletedMeetings(targetUserId);
        Integer participated = userRepository.countTotalMeetings(targetUserId);

        Integer attendanceRate = 0;
        if (participated != null && participated > 0) {
            attendanceRate = (int) Math.round((completed.doubleValue() / participated.doubleValue()) * 100);
        }

        int reviewCount = userReviewRepository.countByTargetUserId(targetUserId);

        String profileImageUrl = user.getUserProfileImageUrl();
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                profileImageUrl = serverBaseUrl + profileImageUrl;
            }
        }

        return PublicProfileDTO.builder()
                .userId(user.getUserId())
                .userNickname(user.getUserNickname())
                .ratingScore(user.getRatingScore())
                .shoppingCompletedCnt(completed)
                .attendanceRate(attendanceRate)
                .createdDate(user.getCreatedDate())
                .reviewCnt(reviewCount)
                .profileImageUrl(profileImageUrl)
                .build();
    }

    @Override
    public void writeReview(Long writerUserId, Long targetUserId, UserReviewCreateRequestDTO request) {

    if (writerUserId.equals(targetUserId)) {
        throw new IllegalArgumentException("자기 자신에게 리뷰를 작성할 수 없습니다.");
    }

    ShoppingPostVO post = shoppingPostDAO.findById(request.getShoppingPostId()).orElse(null);
    if (!"DONE".equalsIgnoreCase(post.getStatusCd())) {
        throw new IllegalStateException("완료된 장보기에만 리뷰 작성 가능합니다.");
    }

    boolean participated = chatParticipantDAO.existsByPostAndUser(request.getShoppingPostId(), writerUserId);
    if (!participated) {
        throw new IllegalStateException("참여하지 않은 장보기에 리뷰 작성 불가");
    }

    int exists = userReviewRepository.countByShoppingPostIdAndWriterUserIdAndTargetUserId(
            request.getShoppingPostId(), writerUserId, targetUserId);
    if (exists > 0) {
        throw new IllegalStateException("이미 리뷰를 작성했습니다.");
    }

    UserReviewVO vo = UserReviewVO.builder()
            .targetUserId(targetUserId)
            .writerUserId(writerUserId)
            .shoppingPostId(request.getShoppingPostId())
            .rating(request.getRating())
            .userReviewComment(request.getComment())
            .build();
    userReviewRepository.save(vo);

    userRepository.updateRatingScoreByAvg(targetUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserReviewDTO> getUserReviews(Long targetUserId) {
        List<UserReviewDTO> reviews = userReviewRepository.selectReviewsForUser(targetUserId);
        
        for (UserReviewDTO review : reviews) {
            String profileImageUrl = review.getWriterProfileImageUrl();
            if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
                if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                    review.setWriterProfileImageUrl(serverBaseUrl + profileImageUrl);
                }
            }
        }
        
        return reviews;
    }

    @Override
    @Transactional(readOnly = true)
    public UserSettingsInfoResponseDTO getSettingsUserInfo(Long userId) {
        UserVO user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        UserSettingsInfoResponseDTO dto = new UserSettingsInfoResponseDTO();
        dto.setName(user.getUserName());
        dto.setNickname(user.getUserNickname());
        dto.setEmail(user.getUserEmail());
        
        String profileImageUrl = user.getUserProfileImageUrl();
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                profileImageUrl = serverBaseUrl + profileImageUrl;
            }
        }
        dto.setProfileImage(profileImageUrl);

        dto.setRole("Y".equalsIgnoreCase(user.getUserType()) ? "admin" : "user");
        return dto;
    }

    @Override
    public UserSettingsInfoResponseDTO updateMyProfile(Long userId, UpdateProfileRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청값이 없습니다.");
        }

        UserVO current = userRepository.findById(userId).orElse(null);
        if (current == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        if (request.getNickname() != null
                && !request.getNickname().isBlank()
                && !request.getNickname().equals(current.getUserNickname())) {
            if (userRepository.existsByUserNickname(request.getNickname())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
            }
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        userRepository.updateUserProfile(
                userId,
                request.getName(),
                request.getNickname(),
                request.getProfileImage(),
                userId,
                now
        );

        return getSettingsUserInfo(userId);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequestDTO request) {
        if (request == null || request.getCurrentPassword() == null || request.getNewPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호 입력값이 누락되었습니다.");
        }

        UserVO user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getUserPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "현재 비밀번호가 올바르지 않습니다.");
        }

        String encoded = passwordEncoder.encode(request.getNewPassword());

        userRepository.updatePassword(userId, encoded);
    }

    @Override
    public void withdrawUser(Long userId) {
        UserVO user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        userRepository.updateUserStatus(userId, "WITHDRAW", userId, now);
    }
}
