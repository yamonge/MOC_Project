package com.cucook.moc.user.controller;

import com.cucook.moc.auth.dto.GoogleLoginRequestDTO;
import com.cucook.moc.auth.dto.FacebookLoginRequestDTO;
import com.cucook.moc.auth.service.GoogleAuthService;
import com.cucook.moc.auth.service.FacebookAuthService;
import com.cucook.moc.user.dto.PublicProfileDTO;
import com.cucook.moc.user.dto.UserProfileDTO;
import com.cucook.moc.user.dto.UserReviewDTO;
import com.cucook.moc.user.dto.request.*;
import com.cucook.moc.user.dto.response.CheckAdminResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cucook.moc.user.dto.response.FindEmailResponseDTO;
import com.cucook.moc.user.dto.response.LoginResponseDTO;
import com.cucook.moc.user.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserAuthController {

    private final UserService userService;
    private final GoogleAuthService googleAuthService;
    private final FacebookAuthService facebookAuthService;

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam("email") String email) {
        boolean duplicate = userService.isDuplicateEmail(email);
        return ResponseEntity.ok(duplicate);
    }
    @PostMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestBody CheckNicknameRequestDTO request) {

        boolean available = userService.isNicknameAvailable(request.getUserNickname());

        Map<String, Boolean> body = new HashMap<>();
        body.put("available", available);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignupRequestDTO request) {
        userService.signup(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 구글 소셜 로그인
     * POST /api/auth/google
     * 
     * @param request Google ID Token + FCM Token
     * @return LoginResponseDTO (일반 로그인과 동일한 응답)
     */
    @PostMapping("/google")
    public ResponseEntity<LoginResponseDTO> googleLogin(@RequestBody GoogleLoginRequestDTO request) {
        LoginResponseDTO response = googleAuthService.googleLogin(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 페이스북 소셜 로그인
     * POST /api/auth/facebook
     * 
     * @param request Facebook Access Token + FCM Token
     * @return LoginResponseDTO (일반 로그인과 동일한 응답)
     */
    @PostMapping("/facebook")
    public ResponseEntity<LoginResponseDTO> facebookLogin(@RequestBody FacebookLoginRequestDTO request) {
        LoginResponseDTO response = facebookAuthService.facebookLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/find-email")
    public ResponseEntity<FindEmailResponseDTO> findEmail(@RequestBody FindEmailRequestDTO request) {
        FindEmailResponseDTO response = userService.findLoginId(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/find-password")
    public ResponseEntity<Void> sendPasswordResetLink(
            @RequestBody FindPasswordRequestDTO request) {

        userService.sendPasswordResetLink(request);
        return ResponseEntity.ok().build();
    }
    
    /*
    * 프론트에서 /reset-password?token=xxxx 페이지에서
    * 새 비밀번호 입력받고, 이 엔드포인트로 전송
    * */
     @PostMapping("/reset-password")
     public ResponseEntity<Void> resetPassword(
             @RequestBody ResetPasswordConfirmRequestDTO request) {

         userService.resetPasswordByToken(request);
         return ResponseEntity.ok().build();
     }


    @PostMapping("/fcm-token")
    public ResponseEntity<Void> updateFcmToken(
        @RequestBody UpdateFcmTokenRequestDTO request) {

    userService.updateFcmToken(request);
    return ResponseEntity.ok().build();
    }

    /**
     * 관리자 권한 여부 확인
     * GET /api/user/check-admin?userId=123
     *
     * - 프론트(AsyncStorage)에 저장된 userId를 그대로 보내서 확인용으로만 사용합니다.
     * - 이 API는 "권한 검증 강제"가 아니라 "상태 조회/판정" 용도입니다.
     */
    @GetMapping("/check-admin")
    public CheckAdminResponseDTO checkAdmin(@RequestParam("userId") Long userId) {
        return userService.checkAdmin(userId);
    }

    /**
     * 내 계정 정보 보기
     * 지금은 userId를 파라미터로 받지만, 나중에 인증 붙이면 토큰에서 꺼내면 됨
     */
    @GetMapping("/me")
    public UserProfileDTO getMyProfile(@RequestParam("userId") Long userId) {
        return userService.getMyProfile(userId);
    }
    /**   
     *  같이 장보기 리뷰에 대한 엔드포인트
     *
     */
    @PostMapping("/{targetUserId}/reviews")
    public void writeReview(
            @PathVariable Long targetUserId,
            @RequestParam Long writerUserId,
            @RequestBody UserReviewCreateRequestDTO request) {

        userService.writeReview(writerUserId, targetUserId, request);
    }

    @GetMapping("/{userId}/reviews")
    public List<UserReviewDTO> getReviews(@PathVariable Long userId) {
        return userService.getUserReviews(userId);
    }

    @GetMapping("/{userId}/public-profile")
    public PublicProfileDTO getPublicProfile(@PathVariable Long userId) {
        return userService.getPublicProfile(userId);
    }
}
