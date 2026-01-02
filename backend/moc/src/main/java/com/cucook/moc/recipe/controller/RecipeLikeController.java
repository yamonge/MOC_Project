package com.cucook.moc.recipe.controller; // ⭐ recipe 패키지 아래에 controller를 생성 (컨벤션 통일)

import com.cucook.moc.recipe.dto.request.RecipeLikeRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeListResponseDTO;
import com.cucook.moc.recipe.service.RecipeLikeService; // 서비스 주입
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // RecipeLikeListResponseDTO 내부에서 사용되므로 필요

/**
 * 사용자 레시피 좋아요 기능에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '좋아요한 게시물' 탭 기능을 담당합니다.
 */
@RestController // RESTful API를 위한 컨트롤러임을 선언
@RequestMapping("/api/v1/users/{userId}/likes") // 사용자별 좋아요 관리를 위한 기본 URL 경로
@CrossOrigin(origins = "*", allowedHeaders = "*") // 개발용 CORS 설정 (모든 오리진 허용)
public class RecipeLikeController {

    private final RecipeLikeService recipeLikeService;

    @Autowired // 생성자 주입
    public RecipeLikeController(RecipeLikeService recipeLikeService) {
        this.recipeLikeService = recipeLikeService;
    }

    /**
     * 특정 사용자가 레시피에 '좋아요'를 누르거나 취소(토글)합니다.
     * POST /api/v1/users/{userId}/likes
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param requestDTO 좋아요/취소할 레시피 ID를 포함하는 요청 DTO
     * @return 좋아요 상태 변경 성공 여부 (true/false)를 담은 응답과 HTTP 상태 코드 (200 OK)
     */
    @PostMapping
    public ResponseEntity<Boolean> toggleRecipeLike(
            @PathVariable("userId") Long userId,
            @RequestBody RecipeLikeRequestDTO requestDTO) {
        try {
            boolean isLiked = recipeLikeService.toggleRecipeLike(userId, requestDTO);
            return new ResponseEntity<>(isLiked, HttpStatus.OK); // 200 OK (좋아요 추가되면 true, 취소되면 false)
        } catch (IllegalArgumentException e) {
            System.err.println("레시피 좋아요 토글 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request (존재하지 않는 레시피 ID 등)
        } catch (Exception e) {
            System.err.println("레시피 좋아요 토글 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자가 좋아요한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * GET /api/v1/users/{userId}/likes
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @return 사용자 좋아요 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<RecipeLikeListResponseDTO> getLikedRecipes(
            @PathVariable("userId") Long userId) {

        RecipeLikeListResponseDTO response =
                recipeLikeService.getLikedRecipes(userId);

        return ResponseEntity.ok(response);
    }

    /**
     * 특정 사용자가 특정 레시피에 좋아요를 눌렀는지 여부를 확인합니다.
     * GET /api/v1/users/{userId}/likes/check/{recipeId}
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 좋아요되어 있으면 true, 아니면 false를 담은 응답과 HTTP 상태 코드 (200 OK)
     */
    @GetMapping("/check/{recipeId}")
    public ResponseEntity<Boolean> isRecipeLiked(
            @PathVariable("userId") Long userId,
            @PathVariable("recipeId") Long recipeId) {
        try {
            boolean isLiked = recipeLikeService.isRecipeLiked(userId, recipeId);
            return new ResponseEntity<>(isLiked, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("레시피 좋아요 상태 확인 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자가 좋아요한 레시피의 총 개수를 조회합니다.
     * GET /api/v1/users/{userId}/likes/count
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 좋아요된 레시피의 총 개수와 HTTP 상태 코드 (200 OK)
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countLikedRecipes(
            @PathVariable("userId") Long userId) {
        try {
            int count = recipeLikeService.countLikedRecipes(userId);
            return new ResponseEntity<>(count, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("좋아요 개수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}