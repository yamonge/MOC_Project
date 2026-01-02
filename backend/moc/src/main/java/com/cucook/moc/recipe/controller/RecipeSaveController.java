package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.dto.request.RecipeSaveRequestDTO;
import com.cucook.moc.recipe.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/recipes")
@RequiredArgsConstructor
public class RecipeSaveController {

    private final RecipeService recipeService;

    @PostMapping
    public ResponseEntity<Long> saveRecipe(
            @PathVariable Long userId,
            @RequestBody RecipeSaveRequestDTO requestDTO
    ) {
        try {
            Long recipeId = recipeService.saveRecipe(userId, requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(recipeId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

