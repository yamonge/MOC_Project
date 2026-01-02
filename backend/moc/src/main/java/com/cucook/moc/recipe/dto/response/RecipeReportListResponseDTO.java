package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeReportListResponseDTO {
    private List<RecipeReportResponseDTO> reportedRecipes; // 신고된 레시피 목록
    private int totalCount;                                   // 전체 신고 개수
}