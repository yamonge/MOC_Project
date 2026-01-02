package com.cucook.moc.user.dto.request;

import lombok.*;

/**
 * 비밀번호 재설정 최종 요청 DTO
 * - 이메일로 받은 링크에 들어있던 token
 * - 새 비밀번호 / 비밀번호 확인
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ResetPasswordConfirmRequestDTO {
    private String token;             // 이메일 링크에 들어있는 resetToken
    private String newPassword;
    private String newPasswordConfirm;
}
