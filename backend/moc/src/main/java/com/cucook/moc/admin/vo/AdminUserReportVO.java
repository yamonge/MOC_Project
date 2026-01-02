// src/main/java/com/cucook/moc/admin/vo/AdminUserReportVO.java
package com.cucook.moc.admin.vo;

import lombok.*;
import java.sql.Timestamp;

/**
 * 사용자 신고 이력 VO
 * - 기본 컬럼: tb_user_report
 * - reporterNickname / reportedNickname 은 tb_user 조인 결과의 별칭 컬럼
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserReportVO {

    // tb_user_report.user_report_id
    private Long userReportId;

    // tb_user_report.reporter_user_id
    private Long reporterUserId;

    // tb_user_report.reported_user_id
    private Long reportedUserId;

    // tb_user_report.report_reason_cd
    private String reportReasonCd;

    // tb_user_report.report_comment
    private String reportComment;

    // tb_user_report.processing_status_cd (PENDING, PROCESSED, REJECTED)
    private String processingStatusCd;

    // tb_user_report.created_date
    private Timestamp createdDate;

    // tb_user_report.processed_date
    private Timestamp processedDate;

    // tb_user_report.processor_id
    private Long processorId;

    // ↓↓↓ tb_user 조인으로 가져오는 별칭 컬럼 (실제 컬럼 아님)
    private String reporterNickname;
    private String reportedNickname;
}
