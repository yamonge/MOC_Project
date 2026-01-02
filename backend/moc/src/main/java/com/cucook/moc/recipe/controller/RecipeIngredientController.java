package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.service.RecipeIngredientService;
import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 레시피 재료 정보를 조회하는 REST 컨트롤러입니다.
 * 특정 레시피에 포함된 재료 목록을 클라이언트에 제공합니다.
 */
@RestController
@RequestMapping("/api/v1/recipes")
public class RecipeIngredientController {

    private final RecipeIngredientService recipeIngredientService;

    // 생성자 주입을 통해 RecipeIngredientService 의존성 주입
    @Autowired
    public RecipeIngredientController(RecipeIngredientService recipeIngredientService) {
        this.recipeIngredientService = recipeIngredientService;
    }

    /**
     * 특정 레시피 ID에 해당하는 모든 재료 목록을 조회합니다.
     * HTTP GET 요청을 통해 /api/v1/recipes/{recipeId}/ingredients 경로로 접근합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 모든 RecipeIngredientVO 리스트와 HTTP 상태 코드
     */
    @GetMapping("/{recipeId}/ingredients")
    public ResponseEntity<List<RecipeIngredientVO>> getRecipeIngredientsByRecipeId(@PathVariable("recipeId") Long recipeId) {
        List<RecipeIngredientVO> ingredients = recipeIngredientService.getRecipeIngredientsByRecipeId(recipeId);

        if (ingredients.isEmpty()) {
            // 재료가 없는 레시피이거나, recipeId가 유효하지 않을 경우
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(ingredients, HttpStatus.OK); // 200 OK
        }
    }
}