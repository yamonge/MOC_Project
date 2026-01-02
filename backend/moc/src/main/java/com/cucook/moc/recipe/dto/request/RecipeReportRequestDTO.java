package com.cucook.moc.recipe.dto.request; // ⭐ recipe 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeReportRequestDTO {
    private Long recipeId;         // 신고할 레시피의 ID (필수)
    private String reportReasonCd; // 신고 사유 코드 (필수)
    private String content;        // 상세 신고 내용
}