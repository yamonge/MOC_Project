package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeStepVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper // 스프링 부트에서 이 인터페이스를 MyBatis 매퍼로 인식하도록 어노테이션 추가
public interface RecipeStepDAO {

    /**
     * 레시피 단계를 데이터베이스에 저장합니다.
     *
     * @param vo 저장할 RecipeStepVO 객체
     * @return 삽입된 레코드 수
     */
    int insertRecipeStep(RecipeStepVO vo);

    /**
     * 특정 레시피 ID에 해당하는 모든 조리 단계를 순서대로 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeStepVO 리스트
     */
    List<RecipeStepVO> selectRecipeStepsByRecipeId(Long recipeId);
}