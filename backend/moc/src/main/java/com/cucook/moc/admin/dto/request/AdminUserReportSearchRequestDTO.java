package com.cucook.moc.admin.dto.request;

import lombok.*;

import lombok.*;

/**
 * 유저 신고 목록 검색 조건 DTO (tb_user_report)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserReportSearchRequestDTO {

    /** 신고자/피신고자 닉네임 검색 키워드 */
    private String keyword;

    /** 신고 사유 코드 (tb_user_report.report_reason_cd) */
    private String reasonCd;

    /** PENDING / PROCESSED / ALL (tb_user_report.processing_status_cd) */
    private String statusCd;

     /** 마지막으로 조회한 user_report_id (첫 요청 시 null) */
    private Long lastUserReportId;

    /** 한 번에 조회할 데이터 수 */
    private Integer limit;
}
