package com.cucook.moc.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * FCM 토큰 저장/업데이트용 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UpdateFcmTokenRequestDTO {
    private Long userId;         // 로그인 응답에서 받은 userId
    private String fcmToken;     // FCM에서 받은 디바이스 토큰
    private String deviceOs;     // 예: "android", "ios"
    private String deviceVersion;// 예: "14", "17.1" 등
}
