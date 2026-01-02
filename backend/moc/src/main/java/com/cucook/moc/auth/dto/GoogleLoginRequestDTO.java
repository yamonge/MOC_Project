package com.cucook.moc.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 구글 로그인 요청 DTO
 * 프론트엔드에서 Google SDK로 받은 idToken을 전달받습니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequestDTO {
    private String idToken;      // Google ID Token
    private String fcmToken;     // FCM 푸시 알림 토큰 (선택)
    private String deviceOs;     // 디바이스 OS (Android/iOS)
    private String deviceVersion; // 디바이스 버전
}
