package com.cucook.moc.admin.controller;

import com.cucook.moc.admin.dto.request.AdminRecipeSearchRequestDTO;
import com.cucook.moc.admin.dto.request.AdminRecipeVisibilityRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListResponseDTO;
import com.cucook.moc.admin.service.AdminRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 관리자 게시글(레시피) 관리 API
 * - 프론트(admin.js / PostManagementScreen) 호출 규격에 맞춤
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/posts")
public class AdminRecipeController {

    private final AdminRecipeService adminRecipeService;

    /**
     * 게시글 목록 조회
     * GET /api/admin/posts?userId=관리자ID&status=all|public|hidden&search=...
     */
    @GetMapping
    public AdminRecipeListResponseDTO getPostList(
            @RequestParam("userId") Long adminUserId,
            @ModelAttribute AdminRecipeSearchRequestDTO request
    ) {
        return adminRecipeService.getRecipeList(adminUserId, request);
    }

    /**
     * 공개/숨김 토글
     * PATCH /api/admin/posts/{postId}/visibility?userId=관리자ID
     * Body: { "hidden": true|false }
     */
    @PatchMapping("/{postId}/visibility")
    public void toggleVisibility(
            @RequestParam("userId") Long adminUserId,
            @PathVariable("postId") Long recipeId,
            @RequestBody AdminRecipeVisibilityRequestDTO body
    ) {
        boolean hidden = body != null && Boolean.TRUE.equals(body.getHidden());
        if (hidden) adminRecipeService.hideRecipe(adminUserId, recipeId);
        else adminRecipeService.showRecipe(adminUserId, recipeId);
    }

    /**
     * 소프트 삭제
     * DELETE /api/admin/posts/{postId}?userId=관리자ID
     */
    @DeleteMapping("/{postId}")
    public void deletePost(
            @RequestParam("userId") Long adminUserId,
            @PathVariable("postId") Long recipeId
    ) {
        adminRecipeService.deleteRecipe(adminUserId, recipeId);
    }
}
