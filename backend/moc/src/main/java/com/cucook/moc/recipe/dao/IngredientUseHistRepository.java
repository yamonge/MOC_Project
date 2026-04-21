package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.IngredientUseHistVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IngredientUseHistRepository extends JpaRepository<IngredientUseHistVO, Long> {

    List<IngredientUseHistVO> findByUserId(Long userId);

    List<IngredientUseHistVO> findByUserIngredientId(Long userIngredientId);

    List<IngredientUseHistVO> findByUserIdAndRecipeId(Long userId, Long recipeId);

    int countByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM IngredientUseHistVO h WHERE h.userId = :userId AND h.recipeId = :recipeId")
    int deleteByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);
}
