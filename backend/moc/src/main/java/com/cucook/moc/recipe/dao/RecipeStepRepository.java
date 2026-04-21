package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeStepVO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeStepRepository extends JpaRepository<RecipeStepVO, Long> {

    List<RecipeStepVO> findByRecipeIdOrderByStepNoAsc(Long recipeId);
}
