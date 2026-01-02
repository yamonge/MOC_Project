package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.dto.response.RecipeBoardListResponseDTO;
import com.cucook.moc.recipe.service.RecipeBoardService;
import com.cucook.moc.recipe.vo.RecipeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/recipes/board")
public class RecipeBoardController {

    private final RecipeBoardService recipeBoardService;

    /**
     * 공개 레시피 게시판 목록
     * 예) /api/v1/recipes/board?search=김치&sort=POPULAR&page=0&size=10
     */
    @GetMapping
    public RecipeBoardListResponseDTO list(
            @RequestParam(required = false) Long loginUserId, // 로그인 붙이면 헤더/토큰으로 바꾸면 됨
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisineStyleCd,
            @RequestParam(required = false) String difficultyCd,
            @RequestParam(required = false) Integer maxCookTimeMin,
            @RequestParam(defaultValue = "LATEST") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return recipeBoardService.getPublicRecipesOptimized(
                loginUserId, search, cuisineStyleCd, difficultyCd, maxCookTimeMin, sort, page, size
        );
    }

    /**
     * 공개 레시피 상세
     */
    @GetMapping("/{recipeId}")
    public RecipeVO detail(
            @PathVariable Long recipeId,
            @RequestParam(required = false) Long loginUserId
    ) {
        return recipeBoardService.getPublicRecipeDetail(recipeId, loginUserId);
    }
}
