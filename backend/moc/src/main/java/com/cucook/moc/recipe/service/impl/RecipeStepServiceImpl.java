package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeStepRepository;
import com.cucook.moc.recipe.service.RecipeStepService;
import com.cucook.moc.recipe.vo.RecipeStepVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeStepServiceImpl implements RecipeStepService {

    private final RecipeStepRepository recipeStepRepository;

    @Autowired
    public RecipeStepServiceImpl(RecipeStepRepository recipeStepRepository) {
        this.recipeStepRepository = recipeStepRepository;
    }

    @Override
    @Transactional
    public int saveRecipeStep(RecipeStepVO recipeStepVO) {
        recipeStepRepository.save(recipeStepVO);
        return 1;
    }

    @Override
    @Transactional
    public int saveAllRecipeSteps(List<RecipeStepVO> recipeStepVOs) {
        recipeStepRepository.saveAll(recipeStepVOs);
        return recipeStepVOs.size();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecipeStepVO> getRecipeStepsByRecipeId(Long recipeId) {
        return recipeStepRepository.findByRecipeIdOrderByStepNoAsc(recipeId);
    }
}
