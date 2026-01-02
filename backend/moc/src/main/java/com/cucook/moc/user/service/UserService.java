package com.cucook.moc.user.service;

import com.cucook.moc.user.dto.PublicProfileDTO;
import com.cucook.moc.user.dto.UserProfileDTO;
import com.cucook.moc.user.dto.UserReviewDTO;
import com.cucook.moc.user.dto.request.*;
import com.cucook.moc.user.dto.response.*;

import java.util.List;

public interface UserService {

    CheckAdminResponseDTO checkAdmin(Long userId);

    boolean isDuplicateEmail(String userEmail);

    void signup(SignupRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);

    FindEmailResponseDTO findLoginId(FindEmailRequestDTO request);

    boolean isNicknameAvailable(String userNickname);

    // 1단계: 비밀번호 재설정 링크 메일 발송
    void sendPasswordResetLink(FindPasswordRequestDTO request);

    // 2단계: 토큰 + 새 비번으로 실제 비밀번호 변경
    void resetPasswordByToken(ResetPasswordConfirmRequestDTO request);

    // FCM Token 업데이트
    void updateFcmToken(UpdateFcmTokenRequestDTO request);

    // 마이페이지: 내 프로필 조회 (닉네임 + 마스킹된 이메일)
    UserProfileDTO getMyProfile(Long userId);

    // 다른 사람 프로필 조회 (닉네임 + 평점 + 장보기 횟수)
    PublicProfileDTO getPublicProfile(Long targetUserId);

    // 특정 유저에 대한 리뷰 목록
    List<UserReviewDTO> getUserReviews(Long targetUserId);

    // 특정 유저에 대한 리뷰 작성 (writerUserId는 컨트롤러에서 전달)
    void writeReview(Long writerUserId, Long targetUserId, UserReviewCreateRequestDTO request);

    // 설정화면 - 유저 정보
    UserSettingsInfoResponseDTO getSettingsUserInfo(Long userId);
    
    // 설정화면 - 유저 프로필 수정
    UserSettingsInfoResponseDTO updateMyProfile(
            Long userId,
            UpdateProfileRequestDTO request
    );
    
    // 설정화면 - 비밀번호 변경
    void changePassword(Long userId, com.cucook.moc.user.dto.request.ChangePasswordRequestDTO request);
    
    // 설정화면 - 회원탈퇴
    void withdrawUser(Long userId);
}
