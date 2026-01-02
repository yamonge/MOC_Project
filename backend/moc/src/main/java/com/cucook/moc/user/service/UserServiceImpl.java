package com.cucook.moc.user.service;

import java.security.SecureRandom;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.util.List;

import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.common.EmailMaskingUtil;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.user.dao.PasswordResetTokenDAO;
import com.cucook.moc.user.dao.UserReviewDAO;
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

import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.dto.response.*;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.MailService;
import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final PasswordResetTokenDAO passwordResetTokenDAO;
    private final UserReviewDAO userReviewDAO;
    private final ShoppingPostDAO shoppingPostDAO;
    private final ChatParticipantDAO chatParticipantDAO;
    
    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;
    
    // 관리자 권한 판정
    @Override
    public CheckAdminResponseDTO checkAdmin(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "USER_ID_REQUIRED");
        }

        UserVO user = userDAO.selectById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
        }

        String userType = user.getUserType();     // 'Y' or 'N'
        String status = user.getUserStatus();     // ACTIVE/SUSPENDED/WITHDRAW

        // 관리자 판정 기준(원하시는 정책에 맞게 최소한만 적용)
        // - user_type='Y' 이면 관리자
        // - WITHDRAW이면 관리자여도 의미 없으므로 false 처리(선택 사항)
        boolean isAdmin = "Y".equalsIgnoreCase(userType) && !"WITHDRAW".equalsIgnoreCase(status);

        return new CheckAdminResponseDTO(isAdmin, userType, status);
    }

    @Override
    public boolean isDuplicateEmail(String userEmail) {
        return userDAO.countByUserEmail(userEmail) > 0;
    }

    @Override
    public void signup(SignupRequestDTO request) {

        // 1. 비밀번호 확인 체크
        if (!request.getUserPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 2. 이메일 중복 체크
        if (isDuplicateEmail(request.getUserEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 3. DTO → VO 매핑
        UserVO user = UserVO.builder()
                .userEmail(request.getUserEmail())
                .userName(request.getUserName())
                .userNickname(request.getUserNickname())
                .userBirthDate(request.getUserBirthDate())
                .userPassword(passwordEncoder.encode(request.getUserPassword()))
                .fcmToken(request.getFcmToken())  // FCM Token 추가
                .userType("N")
                .userStatus("ACTIVE")
                .reportedCnt(0)
                .shoppingCompletedCnt(0)
                .ratingScore(0.0)
                .trustScore(0.0)
                .createdDate(new Timestamp(System.currentTimeMillis()))
                .build();

        // 4. DB 저장
        userDAO.insertUser(user);
    }

    @Override
    public boolean isNicknameAvailable(String userNickname) {
        int count = userDAO.countByNickname(userNickname);
        return count == 0; // 0이면 아직 안 쓰는 닉네임 → 사용 가능
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        // 1. 이메일로 유저 조회
        UserVO user = userDAO.findByUserEmail(request.getUserEmail());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getUserPassword(), user.getUserPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. 상태 체크 (탈퇴 우선)
        if ("WITHDRAW".equalsIgnoreCase(user.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.GONE, "탈퇴한 계정입니다.");
        }

        // ✅ 3-1. 정지 계정 처리 (기간/영구/만료 자동복구)
        if ("SUSPENDED".equalsIgnoreCase(user.getUserStatus())) {

            // 핵심: SUSPENDED일 때만 suspended_until 확인
            java.sql.Timestamp suspendedUntil = user.getSuspendedUntil(); // UserVO에 있어야 함

            // (1) suspended_until NULL => 영구정지
            if (suspendedUntil == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다. (영구정지)");
            }

            // (2) 만료 여부 체크
            java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

            // now >= suspendedUntil 이면 만료 → 자동 복구 후 진행
            if (!now.before(suspendedUntil)) {
                // DB 상태를 ACTIVE로 복구
                int restored = userDAO.restoreExpiredSuspensionToActive(user.getUserId());
                // 복구가 됐든 안됐든(동시성) 재조회로 상태 확정하는 게 가장 안전
                user = userDAO.findByUserEmail(request.getUserEmail());

                // 재조회 결과가 null이면 비정상 상황이므로 방어
                if (user == null) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 처리 중 오류가 발생했습니다.");
                }

                // 혹시 복구가 안됐으면(예: update 조건 불일치) 안전하게 차단
                if ("SUSPENDED".equalsIgnoreCase(user.getUserStatus())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다.");
                }
            } else {
                // (3) 아직 기간이 남아있음 => 차단
                // 필요하면 suspendedUntil 날짜를 메시지에 포함 가능(프론트에서 문구 분기할 때 도움)
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "정지된 계정입니다.");
            }
        }

        // 4. 마지막 로그인 시간 업데이트
        userDAO.updateLastLoginDate(user.getUserId());

        // 4-1. FCM Token 업데이트 (로그인 시)
        if (request.getFcmToken() != null && !request.getFcmToken().isEmpty()) {
            userDAO.updateFcmToken(
                    user.getUserId(),
                    request.getFcmToken(),
                    null,  // deviceOs는 필요시 추가
                    null   // deviceVersion은 필요시 추가
            );
        }

        // 5. VO → 응답 DTO 매핑
        LoginResponseDTO response = new LoginResponseDTO();
        response.setUserId(user.getUserId());
        response.setUserEmail(user.getUserEmail());
        response.setUserName(user.getUserName());
        response.setUserNickname(user.getUserNickname());
        response.setUserType(user.getUserType());
        response.setUserStatus(user.getUserStatus());
        return response;
    }

    @Override
    public FindEmailResponseDTO findLoginId(FindEmailRequestDTO request) {

        UserVO user = userDAO.findByNameAndBirthDate(
                request.getUserName(),
                request.getUserBirthDate()
        );

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "일치하는 사용자가 없습니다.");
        }

        String maskedEmail = EmailMaskingUtil.maskEmail(user.getUserEmail());

        FindEmailResponseDTO response = new FindEmailResponseDTO();
        response.setUserEmail(maskedEmail); // 이메일 마스킹
        return response;
    }


    @Override
    public void sendPasswordResetLink(FindPasswordRequestDTO request) {

        // 1) 사용자 검증
        UserVO user = userDAO.findForPasswordReset(
                request.getUserEmail(),
                request.getUserName(),
                request.getUserBirthDate()
        );

        if (user == null) {
            // IllegalArgumentException -> 404로 내려야 프론트에서 정상 분기 가능
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "일치하는 사용자가 없습니다.");
        }

        // 2) 토큰 생성 (원본 토큰은 이메일로 전달)
        String resetToken = createResetToken();

        // 3) 토큰 해시화 후 DB 저장 (유효시간 예: 1시간)
        String hashedToken = hashToken(resetToken);
        long now = System.currentTimeMillis();

        PasswordResetTokenVO tokenVO = new PasswordResetTokenVO();
        tokenVO.setUserId(user.getUserId());
        tokenVO.setResetToken(hashedToken);
        long expireMillis = now + Duration.ofHours(1).toMillis();   // 토큰 유효시간 설정
        tokenVO.setExpireDate(new Timestamp(expireMillis));
        tokenVO.setCreatedDate(new Timestamp(now));
        tokenVO.setUsedYn("N");

        passwordResetTokenDAO.insertToken(tokenVO);

        // 4) 프론트에서 사용할 URL 생성 (원본 토큰 사용)
        //    예: http://localhost:3010/reset-password?token=xxxx
        String resetUrl = buildResetUrl(resetToken);

        // 5) 메일 발송
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


    // 프론트 URL은 MailServiceImpl에서 @Value 주입해도 됨
    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    // frontend
    private String buildResetUrl(String resetToken) {
        return frontendBaseUrl + "/reset-password?token=" + resetToken;
    }

    @Transactional
    @Override
    public void resetPasswordByToken(ResetPasswordConfirmRequestDTO request) {

        // 0) 필수값 방어
        if (request.getToken() == null || request.getToken().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "토큰이 없습니다.");
        }
        if (request.getNewPassword() == null || request.getNewPasswordConfirm() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호를 입력해주세요.");
        }

        // 1) 비밀번호 확인 검증
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 2) 토큰 조회(해시로 조회)
        String hashedToken = hashToken(request.getToken());
        PasswordResetTokenVO tokenVO = passwordResetTokenDAO.findByToken(hashedToken);

        if (tokenVO == null) {
            // 토큰 자체가 없음
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "유효하지 않은 토큰입니다.");
        }

        // 3) 토큰 사용 여부 체크
        if ("Y".equalsIgnoreCase(tokenVO.getUsedYn())) {
            // 이미 사용된 토큰: 410(Gone) 또는 400 중 택1 (여기선 410 권장)
            throw new ResponseStatusException(HttpStatus.GONE, "이미 사용된 토큰입니다.");
        }

        // 4) 토큰 만료시간 체크
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (tokenVO.getExpireDate() == null || tokenVO.getExpireDate().before(now)) {
            throw new ResponseStatusException(HttpStatus.GONE, "만료된 토큰입니다.");
        }

        // 5) 해당 user_id의 비밀번호 변경
        String encoded = passwordEncoder.encode(request.getNewPassword());
        userDAO.updatePassword(tokenVO.getUserId(), encoded);

        // 6) 토큰 사용 처리
        passwordResetTokenDAO.markTokenUsed(tokenVO.getResetTokenId());
    }

    // FCM Token 업데이트
    @Override
    public void updateFcmToken(UpdateFcmTokenRequestDTO request) {

        if (request.getUserId() == null || request.getFcmToken() == null) {
            throw new IllegalArgumentException("userId와 fcmToken은 필수입니다.");
        }

        userDAO.updateFcmToken(
                request.getUserId(),
                request.getFcmToken(),
                request.getDeviceOs(),
                request.getDeviceVersion()
        );
    }
    
    // 유저 프로필 정보
    @Transactional(readOnly = true)
    public UserProfileDTO getMyProfile(Long userId) {
        UserVO user = userDAO.selectById(userId);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setUserEmail(user.getUserEmail());         // 전체 이메일
        dto.setUserNickname(user.getUserNickname());   // 닉네임
        dto.setUserProfileImageUrl(user.getUserProfileImageUrl()); //유저 프로필
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public PublicProfileDTO getPublicProfile(Long targetUserId) {

        // 1) 유저 조회
        UserVO user = userDAO.selectById(targetUserId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 2) 실시간으로 완료한 모임 수와 참여한 모임 수 조회
        Integer completed = userDAO.countCompletedMeetings(targetUserId);
        Integer participated = userDAO.countTotalMeetings(targetUserId);

        // 3) 참석률 계산 (완료 / 참여 * 100)
        Integer attendanceRate = 0;
        if (participated != null && participated > 0) {
            attendanceRate = (int) Math.round((completed.doubleValue() / participated.doubleValue()) * 100);
        }

        // 4) 후기 개수 조회
        int reviewCount = userReviewDAO.countReceivedUserReviewsByUserId(targetUserId);

        // 5) 프로필 이미지 URL 변환 (상대 경로 → 절대 URL)
        String profileImageUrl = user.getUserProfileImageUrl();
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                profileImageUrl = serverBaseUrl + profileImageUrl;
            }
        }

        // 6) 공개용 프로필 DTO 구성
        return PublicProfileDTO.builder()
                .userId(user.getUserId())
                .userNickname(user.getUserNickname())
                .ratingScore(user.getRatingScore())
                .shoppingCompletedCnt(completed)  // ✅ 실시간 조회값 사용
                .attendanceRate(attendanceRate)
                .createdDate(user.getCreatedDate())
                .reviewCnt(reviewCount)
                .profileImageUrl(profileImageUrl)
                .build();
    }

    // 같이 장보기 유저 리뷰
    @Override
    public void writeReview(Long writerUserId, Long targetUserId, UserReviewCreateRequestDTO request) {

    // 1) 게시글 상태 DONE인지 확인
    ShoppingPostVO post = shoppingPostDAO.selectById(request.getShoppingPostId());
    if (!"DONE".equalsIgnoreCase(post.getStatusCd())) {
        throw new IllegalStateException("완료된 장보기에만 리뷰 작성 가능합니다.");
    }

    // 2) 참여자 여부 확인
    boolean participated = chatParticipantDAO.existsByPostAndUser(request.getShoppingPostId(), writerUserId);
    if (!participated) {
        throw new IllegalStateException("참여하지 않은 장보기에 리뷰 작성 불가");
    }

    // 3) 중복 리뷰 여부
    int exists = userReviewDAO.countExisting(request.getShoppingPostId(), writerUserId, targetUserId);
    if (exists > 0) {
        throw new IllegalStateException("이미 리뷰를 작성했습니다.");
    }

    // 4) INSERT
    UserReviewVO vo = UserReviewVO.builder()
            .targetUserId(targetUserId)
            .writerUserId(writerUserId)
            .shoppingPostId(request.getShoppingPostId())
            .rating(request.getRating())
            .userReviewComment(request.getComment())
            .build();
    userReviewDAO.insertUserReview(vo);

    // 5) 평점 업데이트
    userDAO.updateRatingScoreByAvg(targetUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserReviewDTO> getUserReviews(Long targetUserId) {
        List<UserReviewDTO> reviews = userReviewDAO.selectReviewsForUser(targetUserId);
        
        // 프로필 이미지 URL 변환 (상대 경로 → 절대 URL)
        for (UserReviewDTO review : reviews) {
            String profileImageUrl = review.getWriterProfileImageUrl();
            if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
                // 이미 절대 URL이면 그대로, 상대 경로면 절대 URL로 변환
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
        UserVO user = userDAO.selectById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        UserSettingsInfoResponseDTO dto = new UserSettingsInfoResponseDTO();
        dto.setName(user.getUserName());
        dto.setNickname(user.getUserNickname());
        dto.setEmail(user.getUserEmail());
        
        // 프로필 이미지 URL 변환 (상대 경로 → 절대 URL)
        String profileImageUrl = user.getUserProfileImageUrl();
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            // 이미 절대 URL이면 그대로, 상대 경로면 절대 URL로 변환
            if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                profileImageUrl = serverBaseUrl + profileImageUrl;
            }
        }
        dto.setProfileImage(profileImageUrl);

        // ✅ [추가] user_type: 'Y'면 admin, 그 외 user
        dto.setRole("Y".equalsIgnoreCase(user.getUserType()) ? "admin" : "user");
        return dto;
    }
    // 설정 - 프로필 수정
    @Override
    public UserSettingsInfoResponseDTO updateMyProfile(Long userId, UpdateProfileRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청값이 없습니다.");
        }

        UserVO current = userDAO.selectById(userId);
        if (current == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        // ✅ [추가] 닉네임 변경 시 중복 체크(본인 닉네임이면 통과)
        if (request.getNickname() != null
                && !request.getNickname().isBlank()
                && !request.getNickname().equals(current.getUserNickname())) {
            int cnt = userDAO.countByNickname(request.getNickname());
            if (cnt > 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
            }
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        // ✅ [추가] DB 업데이트
        userDAO.updateUserProfile(
                userId,
                request.getName(),
                request.getNickname(),
                request.getProfileImage(),
                userId,  // updated_id
                now      // updated_date
        );

        // ✅ [추가] 업데이트 후 최신값 반환
        return getSettingsUserInfo(userId);
    }
    // 설정 - 비밀번호 변경
    @Override
    public void changePassword(Long userId, ChangePasswordRequestDTO request) {
        if (request == null || request.getCurrentPassword() == null || request.getNewPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호 입력값이 누락되었습니다.");
        }

        UserVO user = userDAO.selectById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        // ✅ [추가] 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getUserPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "현재 비밀번호가 올바르지 않습니다.");
        }

        String encoded = passwordEncoder.encode(request.getNewPassword());

        // 기존 DAO 메소드 재사용 (이미 존재) :contentReference[oaicite:6]{index=6}
        userDAO.updatePassword(userId, encoded);
    }
    // 설정 - 회원탈퇴
    @Override
    public void withdrawUser(Long userId) {
        UserVO user = userDAO.selectById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        // ✅ [추가] tb_user.user_status = WITHDRAW (DDL 주석) :contentReference[oaicite:7]{index=7}
        userDAO.updateUserStatus(userId, "WITHDRAW", userId, now);
    }
}