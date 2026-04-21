package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeIngredientRepository;
import com.cucook.moc.recipe.service.RecipeIngredientService;
import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeIngredientServiceImpl implements RecipeIngredientService {

    private final RecipeIngredientRepository recipeIngredientRepository;

    @Autowired
    public RecipeIngredientServiceImpl(RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    @Override
    @Transactional
    public int saveRecipeIngredient(RecipeIngredientVO recipeIngredientVO) {
        recipeIngredientRepository.save(recipeIngredientVO);
        return 1;
    }

    @Override
    @Transactional
    public int saveAllRecipeIngredients(List<RecipeIngredientVO> recipeIngredientVOs) {
        recipeIngredientRepository.saveAll(recipeIngredientVOs);
        return recipeIngredientVOs.size();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecipeIngredientVO> getRecipeIngredientsByRecipeId(Long recipeId) {
        return recipeIngredientRepository.findByRecipeId(recipeId);
    }
}
