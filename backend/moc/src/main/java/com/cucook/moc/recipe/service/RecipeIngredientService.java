package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.vo.RecipeIngredientVO;

import java.util.List;

/**
 * 레시피 재료 정보와 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 */
public interface RecipeIngredientService {

    /**
     * 레시피 재료 정보를 데이터베이스에 저장합니다.
     *
     * @param recipeIngredientVO 저장할 RecipeIngredientVO 객체
     * @return 삽입된 레코드 수
     */
    int saveRecipeIngredient(RecipeIngredientVO recipeIngredientVO);

    /**
     * 여러 레시피 재료 정보를 한 번에 데이터베이스에 저장합니다.
     *
     * @param recipeIngredientVOs 저장할 RecipeIngredientVO 객체 리스트
     * @return 총 삽입된 레코드 수
     */
    int saveAllRecipeIngredients(List<RecipeIngredientVO> recipeIngredientVOs);


    /**
     * 특정 레시피 ID에 해당하는 모든 재료 목록을 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeIngredientVO 리스트
     */
    List<RecipeIngredientVO> getRecipeIngredientsByRecipeId(Long recipeId);
}