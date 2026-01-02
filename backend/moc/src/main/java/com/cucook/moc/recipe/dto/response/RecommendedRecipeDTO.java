package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedRecipeDTO {
    private Long recipeId;                         // DB에 저장된 레시피 ID (선택 사항, 상세 조회 시 사용)
    private String title;                          // 레시피 제목
    private String summary;                        // 레시피 요약
    private String thumbnailUrl;                   // 레시피 대표 이미지 URL
    private String difficultyCd;                   // 난이도 코드 (예: EASY, NORMAL, HARD)
    private Integer cookTimeMin;                   // 조리 시간 (분 단위)
    private String cuisineStyleCd;                 // 요리 스타일 코드 (예: KOR, CHN, JPN)
    private String category;

    private List<RecipeIngredientResponseDTO> requiredIngredients; // 필요한 재료 목록 (보유/부족 표시 포함)
    private List<RecipeStepResponseDTO> cookingSteps;              // 조리 순서 목록
}