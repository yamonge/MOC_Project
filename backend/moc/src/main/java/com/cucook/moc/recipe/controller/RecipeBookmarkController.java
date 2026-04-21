package com.cucook.moc.recipe.controller; // recipe 패키지 아래에 controller를 생성 (컨벤션 통일)

import com.cucook.moc.recipe.dto.request.RecipeBookmarkRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkResponseDTO;
import com.cucook.moc.recipe.service.RecipeBookmarkService; // 서비스 주입
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 레시피 북마크(저장) 기능에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '저장된 게시글' 탭 기능을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{userId}/bookmarks")
public class RecipeBookmarkController {

    private final RecipeBookmarkService recipeBookmarkService;

    @Autowired // 생성자 주입
    public RecipeBookmarkController(RecipeBookmarkService recipeBookmarkService) {
        this.recipeBookmarkService = recipeBookmarkService;
    }

    /**
     * 특정 사용자가 레시피를 북마크(저장)합니다.
     * POST /api/v1/users/{userId}/bookmarks
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param requestDTO 저장할 레시피 ID를 포함하는 요청 DTO
     * @return 저장된 레시피 정보를 담은 응답 DTO와 HTTP 상태 코드 (201 Created 또는 200 OK)
     */
    @PostMapping
    public ResponseEntity<RecipeBookmarkResponseDTO> addRecipeBookmark(
            @PathVariable("userId") Long ignoredUserId,
            @RequestBody RecipeBookmarkRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            RecipeBookmarkResponseDTO response = recipeBookmarkService.addRecipeBookmark(userId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 북마크한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * GET /api/v1/users/{userId}/bookmarks
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @return 사용자 북마크 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<RecipeBookmarkListResponseDTO> getBookmarkedRecipes(
            @PathVariable("userId") Long ignoredUserId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        RecipeBookmarkListResponseDTO response =
                recipeBookmarkService.getBookmarkedRecipes(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * 마이페이지 > 공유한 게시글
     * 내가 저장했고 공개한 레시피 목록
     */
    @GetMapping("/my-public")
    public ResponseEntity<RecipeBookmarkListResponseDTO> getMyPublicRecipes(
            @PathVariable("userId") Long ignoredUserId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(
                recipeBookmarkService.getMyPublicRecipes(userId)
        );
    }

    /**
     * 특정 사용자가 저장한 특정 레시피 북마크를 삭제합니다. (저장 취소)
     * DELETE /api/v1/users/{userId}/bookmarks/{recipeId}
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param recipeId 경로 변수에서 가져온 레시피 ID
     * @return HTTP 상태 코드 (204 No Content 또는 403 Forbidden)
     */
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipeBookmark(
            @PathVariable("userId") Long ignoredUserId,
            @PathVariable("recipeId") Long recipeId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            boolean deleted = recipeBookmarkService.deleteRecipeBookmark(userId, recipeId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 특정 레시피를 북마크했는지 여부를 확인합니다.
     * GET /api/v1/users/{userId}/bookmarks/check/{recipeId}
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 북마크되어 있으면 true, 아니면 false를 담은 응답과 HTTP 상태 코드 (200 OK)
     */
    @GetMapping("/check/{recipeId}")
    public ResponseEntity<Boolean> isRecipeBookmarked(
            @PathVariable("userId") Long ignoredUserId,
            @PathVariable("recipeId") Long recipeId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            boolean isBookmarked = recipeBookmarkService.isRecipeBookmarked(userId, recipeId);
            return new ResponseEntity<>(isBookmarked, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 북마크한 레시피의 총 개수를 조회합니다.
     * GET /api/v1/users/{userId}/bookmarks/count
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 북마크된 레시피의 총 개수와 HTTP 상태 코드 (200 OK)
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countBookmarkedRecipes(
            @PathVariable("userId") Long ignoredUserId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            int count = recipeBookmarkService.countBookmarkedRecipes(userId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}