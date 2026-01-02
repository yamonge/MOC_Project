package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RecipeIngredientDAO {

    /**
     * 레시피에 필요한 재료 정보를 데이터베이스에 저장합니다.
     *
     * @param vo 저장할 RecipeIngredientVO 객체
     * @return 삽입된 레코드 수
     */
    int insertRecipeIngredient(RecipeIngredientVO vo);

    /**
     * 특정 레시피 ID에 해당하는 모든 재료 목록을 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeIngredientVO 리스트
     */
    List<RecipeIngredientVO> selectRecipeIngredientsByRecipeId(Long recipeId);
}