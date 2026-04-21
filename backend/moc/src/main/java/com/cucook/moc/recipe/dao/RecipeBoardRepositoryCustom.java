package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import com.cucook.moc.recipe.vo.RecipeVO;

import java.util.List;

public interface RecipeBoardRepositoryCustom {

    List<RecipeBoardListItemVO> findPublicRecipes(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int offset,
            int limit
    );

    int countPublicRecipes(
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin
    );

    RecipeVO findPublicRecipeById(Long recipeId, Long loginUserId);

    List<RecipeBoardListItemVO> findPublicRecipesOptimized(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int offset,
            int limit
    );
}
