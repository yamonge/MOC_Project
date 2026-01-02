package com.cucook.moc.user.controller;

import com.cucook.moc.common.FileUploadUtil;
import com.cucook.moc.user.dto.request.ChangePasswordRequestDTO;
import com.cucook.moc.user.dto.request.UpdateProfileRequestDTO;
import com.cucook.moc.user.dto.response.UserSettingsInfoResponseDTO;
import com.cucook.moc.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserSettingsController {

    private final UserService userService;
    private final FileUploadUtil fileUploadUtil;

    public UserSettingsController(UserService userService, FileUploadUtil fileUploadUtil) {
        this.userService = userService;
        this.fileUploadUtil = fileUploadUtil;
    }

    /**
     * ✅ [추가] 설정/프로필수정 공용: 내 정보 조회
     * - axiosConfig가 ?userId= 를 자동으로 붙여줌
     */
    @GetMapping("/me")
    public ResponseEntity<UserSettingsInfoResponseDTO> getMe(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(userService.getSettingsUserInfo(userId));
    }

    /**
     * ✅ [수정] 프로필 수정 - 파일 시스템 저장 방식
     */
    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserSettingsInfoResponseDTO> updateProfile(
            @RequestParam("userId") Long userId,
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "nickname", required = false) String nickname,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        UpdateProfileRequestDTO request = new UpdateProfileRequestDTO();
        request.setName(name);
        request.setNickname(nickname);

        // 프로필 이미지 파일 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            // 파일 유효성 검증
            if (!FileUploadUtil.isValidImageFile(profileImage)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 이미지 파일 형식입니다.");
            }
            if (!FileUploadUtil.isValidFileSize(profileImage)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 크기는 10MB를 초과할 수 없습니다.");
            }

            try {
                // 파일 저장 후 절대 URL 획득
                String imageUrl = fileUploadUtil.saveProfileImage(profileImage);
                request.setProfileImage(imageUrl);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 이미지 저장 실패: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(userService.updateMyProfile(userId, request));
    }

    /**
     * ✅ [추가] 비밀번호 변경 (현재 비밀번호 검증)
     */
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestParam("userId") Long userId,
            @RequestBody ChangePasswordRequestDTO request
    ) {
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ [추가] 회원탈퇴 (tb_user.user_status = WITHDRAW)
     */
    @DeleteMapping("/withdraw")
    public ResponseEntity<Void> withdraw(@RequestParam("userId") Long userId) {
        userService.withdrawUser(userId);
        return ResponseEntity.ok().build();
    }
}
