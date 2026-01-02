package com.cucook.moc.admin.vo;

import lombok.*;
import java.sql.Timestamp;

/**
 * 관리자 회원 관리에서 사용하는 회원 정보 VO
 * - tb_user 테이블 컬럼만 매핑 (필요한 컬럼만 사용)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserVO {

    // tb_user.user_id
    private Long userId;

    // tb_user.user_email
    private String userEmail;

    // tb_user.user_name
    private String userName;

    // tb_user.user_nickname
    private String userNickname;

    // tb_user.user_type ('N'=일반, 'Y'=관리자)
    private String userType;

    // tb_user.user_status (ACTIVE, SUSPENDED, WITHDRAW 등)
    private String userStatus;

    // tb_user.reported_cnt
    private Integer reportedCnt;

    // tb_user.suspended_until
    private Timestamp suspendedUntil;

    // tb_user.suspended_reason
    private String suspendedReason;

    // tb_user.created_date (가입일)
    private Timestamp createdDate;
}
