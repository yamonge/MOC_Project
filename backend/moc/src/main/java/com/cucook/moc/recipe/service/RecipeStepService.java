package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.vo.RecipeStepVO;

import java.util.List;

/**
 * 레시피 조리 단계 정보와 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 */
public interface RecipeStepService {

    /**
     * 레시피 조리 단계 정보를 데이터베이스에 저장합니다.
     *
     * @param recipeStepVO 저장할 RecipeStepVO 객체
     * @return 삽입된 레코드 수
     */
    int saveRecipeStep(RecipeStepVO recipeStepVO);

    /**
     * 여러 레시피 조리 단계 정보를 한 번에 데이터베이스에 저장합니다.
     *
     * @param recipeStepVOs 저장할 RecipeStepVO 객체 리스트
     * @return 총 삽입된 레코드 수
     */
    int saveAllRecipeSteps(List<RecipeStepVO> recipeStepVOs);

    /**
     * 특정 레시피 ID에 해당하는 모든 조리 단계 목록을 조회합니다.
     * 조리 단계 번호(stepNo) 순서로 정렬하여 반환합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeStepVO 리스트
     */
    List<RecipeStepVO> getRecipeStepsByRecipeId(Long recipeId);
}