package com.cucook.moc.admin.dto.request;

import lombok.*;

/**
 * 관리자 - 회원 탈퇴 처리 요청 DTO
 * (user_status 를 WITHDRAW 로 변경)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserWithdrawRequestDTO {

   private Long adminUserId;

    /** 탈퇴 사유(로그용) */
    private String reason;
}
