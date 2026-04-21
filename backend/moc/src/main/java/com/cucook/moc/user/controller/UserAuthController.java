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
import org.springframework.security.core.Authentication;
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

    @PostMapping("/google")
    public ResponseEntity<LoginResponseDTO> googleLogin(@RequestBody GoogleLoginRequestDTO request) {
        LoginResponseDTO response = googleAuthService.googleLogin(request);
        return ResponseEntity.ok(response);
    }

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
    public ResponseEntity<Void> sendPasswordResetLink(@RequestBody FindPasswordRequestDTO request) {
        userService.sendPasswordResetLink(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordConfirmRequestDTO request) {
        userService.resetPasswordByToken(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/fcm-token")
    public ResponseEntity<Void> updateFcmToken(Authentication authentication,
                                                @RequestBody UpdateFcmTokenRequestDTO request) {
        Long userId = (Long) authentication.getPrincipal();
        request.setUserId(userId);
        userService.updateFcmToken(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-admin")
    public CheckAdminResponseDTO checkAdmin(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.checkAdmin(userId);
    }

    @GetMapping("/me")
    public UserProfileDTO getMyProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.getMyProfile(userId);
    }

    @PostMapping("/{targetUserId}/reviews")
    public void writeReview(
            Authentication authentication,
            @PathVariable Long targetUserId,
            @RequestBody UserReviewCreateRequestDTO request) {
        Long writerUserId = (Long) authentication.getPrincipal();
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
