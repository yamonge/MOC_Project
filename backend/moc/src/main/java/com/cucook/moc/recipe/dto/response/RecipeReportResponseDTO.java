package com.cucook.moc.recipe.dto.response; // ⭐ recipe 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime; // UI 표시용
import java.time.format.DateTimeFormatter; // 날짜 포맷팅용

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeReportResponseDTO {
    private Long reportId;         // 신고 ID (tb_recipe_report.recipe_report_id)
    private Long recipeId;         // 신고된 레시피 ID (tb_recipe_report.recipe_id)
    private Long reporterUserId;   // 신고한 사용자 ID (tb_recipe_report.reporter_user_id)
    private String reporterNickname; // 신고자 닉네임
    private String reportReasonCd; // 신고 사유 코드
    private String content;        // 상세 신고 내용
    private String statusCd;       // ⭐ 처리 상태 (PENDING, APPROVED, REJECTED)
    private Timestamp createdDate;  // 신고일시
    private String createdDateFormatted; // ⭐ UI 표시용: "YYYY-MM-DD HH:mm:ss" 포맷
    private Timestamp updatedDate;  // 마지막 수정 일시 (관리자 처리 시)
    private String updatedDateFormatted; // UI 표시용
    private ReportedRecipeDetailDTO reportedRecipe;

    // RecipeReportVO와 ReportedRecipeDetailDTO를 기반으로 DTO를 생성하는 편의 메서드
    public static RecipeReportResponseDTO from(
            com.cucook.moc.recipe.vo.RecipeReportVO reportVO,
            ReportedRecipeDetailDTO reportedRecipeDetailDTO) {

        RecipeReportResponseDTO dto = new RecipeReportResponseDTO();
        dto.setReportId(reportVO.getReportId());
        dto.setRecipeId(reportVO.getRecipeId());
        dto.setReporterUserId(reportVO.getReporterUserId());
        dto.setReporterNickname(reportVO.getReporterNickname());
        dto.setReportReasonCd(reportVO.getReportReasonCd());
        dto.setContent(reportVO.getContent());
        dto.setStatusCd(reportVO.getStatusCd());
        dto.setCreatedDate(reportVO.getCreatedDate());
        dto.setUpdatedDate(reportVO.getUpdatedDate());

        // 날짜 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (reportVO.getCreatedDate() != null) {
            dto.setCreatedDateFormatted(reportVO.getCreatedDate().toLocalDateTime().format(formatter));
        } else {
            dto.setCreatedDateFormatted(null);
        }
        if (reportVO.getUpdatedDate() != null) {
            dto.setUpdatedDateFormatted(reportVO.getUpdatedDate().toLocalDateTime().format(formatter));
        } else {
            dto.setUpdatedDateFormatted(null);
        }
        dto.setReportedRecipe(reportedRecipeDetailDTO);

        return dto;
    }
}