package com.cucook.moc.admin.dto.request;

import lombok.*;

/**
 * 관리자 - 계정 정지 요청 DTO
 * (tb_user.user_status, tb_user.suspended_until, tb_user.suspended_reason 갱신)
 * body 예:
 * { "reason": "관리자 직접 정지", "duration": 7 }
 * { "duration": "permanent" }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserSuspendRequestDTO {

    // ONE_DAY / THREE_DAYS / SEVEN_DAYS / PERMANENT
    private String suspendType;

    private String reason;

   /** 처리 관리자 ID (tb_user.user_id, user_type='Y') */
   private Long adminUserId;
}
