package com.cucook.moc.user.controller;

import com.cucook.moc.common.FileUploadUtil;
import com.cucook.moc.user.dto.request.ChangePasswordRequestDTO;
import com.cucook.moc.user.dto.request.UpdateProfileRequestDTO;
import com.cucook.moc.user.dto.response.UserSettingsInfoResponseDTO;
import com.cucook.moc.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/me")
    public ResponseEntity<UserSettingsInfoResponseDTO> getMe(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getSettingsUserInfo(userId));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserSettingsInfoResponseDTO> updateProfile(
            Authentication authentication,
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "nickname", required = false) String nickname,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        Long userId = (Long) authentication.getPrincipal();
        UpdateProfileRequestDTO request = new UpdateProfileRequestDTO();
        request.setName(name);
        request.setNickname(nickname);

        if (profileImage != null && !profileImage.isEmpty()) {
            if (!FileUploadUtil.isValidImageFile(profileImage)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 이미지 파일 형식입니다.");
            }
            if (!FileUploadUtil.isValidFileSize(profileImage)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 크기는 10MB를 초과할 수 없습니다.");
            }

            try {
                String imageUrl = fileUploadUtil.saveProfileImage(profileImage);
                request.setProfileImage(imageUrl);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 이미지 저장 실패: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(userService.updateMyProfile(userId, request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequestDTO request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<Void> withdraw(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        userService.withdrawUser(userId);
        return ResponseEntity.ok().build();
    }
}
