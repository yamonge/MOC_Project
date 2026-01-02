package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RecipeBoardDAO {

    List<RecipeBoardListItemVO> selectPublicRecipes(
            @Param("loginUserId") Long loginUserId,
            @Param("search") String search,
            @Param("cuisineStyleCd") String cuisineStyleCd,
            @Param("difficultyCd") String difficultyCd,
            @Param("maxCookTimeMin") Integer maxCookTimeMin,
            @Param("sort") String sort,          // "LATEST" | "POPULAR"
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    int countPublicRecipes(
            @Param("search") String search,
            @Param("cuisineStyleCd") String cuisineStyleCd,
            @Param("difficultyCd") String difficultyCd,
            @Param("maxCookTimeMin") Integer maxCookTimeMin
    );

    RecipeVO selectPublicRecipeById(
            @Param("recipeId") Long recipeId,
            @Param("loginUserId") Long loginUserId
    );

    // ** 신규 추가: LISTAGG 최적화 쿼리 메소드 **
    List<RecipeBoardListItemVO> selectPublicRecipesOptimized(
            @Param("loginUserId") Long loginUserId,
            @Param("search") String search,
            @Param("cuisineStyleCd") String cuisineStyleCd,
            @Param("difficultyCd") String difficultyCd,
            @Param("maxCookTimeMin") Integer maxCookTimeMin,
            @Param("sort") String sort,
            @Param("offset") int offset,
            @Param("limit") int limit
    );
}
