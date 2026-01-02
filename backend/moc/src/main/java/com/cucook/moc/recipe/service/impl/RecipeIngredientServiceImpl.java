package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeIngredientDAO;
import com.cucook.moc.recipe.service.RecipeIngredientService;
import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeIngredientServiceImpl implements RecipeIngredientService {

    private final RecipeIngredientDAO recipeIngredientDAO;

    // 생성자 주입 방식으로 DAO 의존성 주입
    @Autowired
    public RecipeIngredientServiceImpl(RecipeIngredientDAO recipeIngredientDAO) {
        this.recipeIngredientDAO = recipeIngredientDAO;
    }

    /**
     * 레시피 재료 정보를 데이터베이스에 저장합니다.
     *
     * @param recipeIngredientVO 저장할 RecipeIngredientVO 객체
     * @return 삽입된 레코드 수
     */
    @Override
    @Transactional
    public int saveRecipeIngredient(RecipeIngredientVO recipeIngredientVO) {
        // 단일 재료 저장 로직
        return recipeIngredientDAO.insertRecipeIngredient(recipeIngredientVO);
    }

    /**
     * 여러 레시피 재료 정보를 한 번에 데이터베이스에 저장합니다.
     * 개별적으로 insert를 여러 번 호출하며, 트랜잭션으로 묶어 원자성을 보장합니다.
     *
     * @param recipeIngredientVOs 저장할 RecipeIngredientVO 객체 리스트
     * @return 총 삽입된 레코드 수
     */
    @Override
    @Transactional
    public int saveAllRecipeIngredients(List<RecipeIngredientVO> recipeIngredientVOs) {
        int insertedCount = 0;
        for (RecipeIngredientVO vo : recipeIngredientVOs) {
            insertedCount += recipeIngredientDAO.insertRecipeIngredient(vo);
        }
        return insertedCount;
    }

    /**
     * 특정 레시피 ID에 해당하는 모든 재료 목록을 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeIngredientVO 리스트
     */
    @Override
    @Transactional(readOnly = true)
    public List<RecipeIngredientVO> getRecipeIngredientsByRecipeId(Long recipeId) {
        // 비즈니스 로직 추가 가능 (예: 캐싱, 권한 확인 등)
        return recipeIngredientDAO.selectRecipeIngredientsByRecipeId(recipeId);
    }
}