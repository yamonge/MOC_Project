package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredientVO, Long> {

    List<RecipeIngredientVO> findByRecipeId(Long recipeId);
}
