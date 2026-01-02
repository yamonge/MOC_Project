package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeStepDAO;
import com.cucook.moc.recipe.service.RecipeStepService;
import com.cucook.moc.recipe.vo.RecipeStepVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeStepServiceImpl implements RecipeStepService {

    private final RecipeStepDAO recipeStepDAO;

    // 생성자 주입 방식으로 DAO 의존성 주입
    @Autowired
    public RecipeStepServiceImpl(RecipeStepDAO recipeStepDAO) {
        this.recipeStepDAO = recipeStepDAO;
    }

    /**
     * 레시피 조리 단계 정보를 데이터베이스에 저장합니다.
     *
     * @param recipeStepVO 저장할 RecipeStepVO 객체
     * @return 삽입된 레코드 수
     */
    @Override
    @Transactional
    public int saveRecipeStep(RecipeStepVO recipeStepVO) {
        // 단일 조리 단계 저장 로직
        return recipeStepDAO.insertRecipeStep(recipeStepVO);
    }

    /**
     * 여러 레시피 조리 단계 정보를 한 번에 데이터베이스에 저장합니다.
     * 개별적으로 insert를 여러 번 호출하며, 트랜잭션으로 묶어 원자성을 보장합니다.
     *
     * @param recipeStepVOs 저장할 RecipeStepVO 객체 리스트
     * @return 총 삽입된 레코드 수
     */
    @Override
    @Transactional
    public int saveAllRecipeSteps(List<RecipeStepVO> recipeStepVOs) {
        int insertedCount = 0;
        for (RecipeStepVO vo : recipeStepVOs) {
            insertedCount += recipeStepDAO.insertRecipeStep(vo);
        }
        return insertedCount;
    }

    /**
     * 특정 레시피 ID에 해당하는 모든 조리 단계 목록을 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeStepVO 리스트
     */
    @Override
    @Transactional(readOnly = true)
    public List<RecipeStepVO> getRecipeStepsByRecipeId(Long recipeId) {
        // 비즈니스 로직 추가 가능 (예: 캐싱, 권한 확인 등)
        return recipeStepDAO.selectRecipeStepsByRecipeId(recipeId);
    }
}