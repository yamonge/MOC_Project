package com.cucook.moc.admin.dto.request;

import lombok.*;

/**
 * 레시피 신고 목록 검색 조건 DTO (tb_recipe_report)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminRecipeReportSearchRequestDTO {

    /** 신고자/레시피 제목 검색 키워드 */
    private String keyword;

    /** 신고 사유 코드 (tb_recipe_report.report_reason_cd) */
    private String reasonCd;

    /** PENDING / APPROVED / REJECTED / ALL (tb_recipe_report.status_cd) */
    private String statusCd;

    /** 마지막으로 조회한 recipe_report_id (첫 요청 시 null) */
    private Long lastRecipeReportId;

    /** 한 번에 조회할 데이터 수 */
    private Integer limit;
}

