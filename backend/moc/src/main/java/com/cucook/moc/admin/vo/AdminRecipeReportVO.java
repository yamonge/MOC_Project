package com.cucook.moc.admin.vo;

import lombok.*;
import java.sql.Timestamp;

/**
 * 레시피 신고 이력 VO
 * - 기본 컬럼: tb_recipe_report
 * - reporterNickname / recipeTitle 은 조인 결과의 별칭 컬럼
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminRecipeReportVO {

    // tb_recipe_report.recipe_report_id
    private Long recipeReportId;

    // tb_recipe_report.recipe_id
    private Long recipeId;

    // tb_recipe_report.reporter_user_id
    private Long reporterUserId;

    // tb_recipe_report.report_reason_cd
    private String reportReasonCd;

    // tb_recipe_report.content
    private String content;

    // tb_recipe_report.status_cd (PENDING, APPROVED, REJECTED)
    private String statusCd;

    // tb_recipe_report.created_date
    private Timestamp createdDate;

    // tb_recipe_report.updated_date
    private Timestamp updatedDate;

    // ↓↓↓ 조인으로 가져오는 별칭 컬럼 (실제 컬럼 아님)
    private String reporterNickname;
    private String recipeTitle;
    private Long recipeOwnerUserId;
    private String recipeOwnerNickname;
}

