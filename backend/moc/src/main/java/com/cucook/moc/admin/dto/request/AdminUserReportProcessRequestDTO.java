package com.cucook.moc.admin.dto.request;

import lombok.*;

/**
 * 유저 신고 처리(경고/계정정지/반려) 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserReportProcessRequestDTO {

    /** tb_user_report.user_report_id */
    private Long userReportId;

    /** 신고 대상 사용자 (tb_user_report.reported_user_id) */
    private Long reportedUserId;

    /** 처리 관리자 ID (user_type='Y') */
    private Long adminUserId;

    /** WARNING / SUSPEND / REJECT */
    private String actionType;

    /** SUSPEND 선택 시 정지 기간 타입 */
    private String suspendType;
}
