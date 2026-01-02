package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRecommendationResponseDTO {
    private List<RecommendedRecipeDTO> recommendedRecipes; // 추천된 레시피 목록 (일반적으로 상위 3개)
    private String status;
    private String message;
}