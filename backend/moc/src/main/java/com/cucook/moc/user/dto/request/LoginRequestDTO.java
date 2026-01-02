package com.cucook.moc.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 로그인 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class LoginRequestDTO {
    private String fcmToken;
    private String userEmail;
    private String userPassword;
}
