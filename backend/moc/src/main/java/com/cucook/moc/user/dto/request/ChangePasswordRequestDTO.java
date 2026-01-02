package com.cucook.moc.user.dto.request;

import lombok.*;

// 설정화면 - 비밀번호 변경
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChangePasswordRequestDTO {
    private String currentPassword;
    private String newPassword;
}
