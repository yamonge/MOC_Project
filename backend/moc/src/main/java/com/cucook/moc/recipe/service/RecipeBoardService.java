package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.dto.response.RecipeBoardListResponseDTO;
import com.cucook.moc.recipe.vo.RecipeVO;

public interface RecipeBoardService {

    RecipeBoardListResponseDTO getPublicRecipes(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int page,
            int size
    );

    RecipeVO getPublicRecipeDetail(Long recipeId, Long loginUserId);

    RecipeBoardListResponseDTO getPublicRecipesOptimized(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int page,
            int size
    );
}
