package com.cucook.moc.user.dto.response;

import lombok.*;

/**
 * 로그인 응답 DTO
 * (민감 정보는 제외)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LoginResponseDTO {
    private Long userId;
    private String userEmail;
    private String userName;
    private String userNickname;
    private String userType;
    private String userStatus;
}
