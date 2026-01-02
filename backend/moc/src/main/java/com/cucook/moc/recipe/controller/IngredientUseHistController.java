package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.dto.response.IngredientUseHistListResponseDTO;
import com.cucook.moc.recipe.dto.response.IngredientUseHistResponseDTO;
import com.cucook.moc.recipe.service.IngredientUseHistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 재료 사용 이력(tb_ingredient_use_hist)에 대한 REST API를 처리하는 컨트롤러입니다.
 * 주로 개발자 및 관리자의 이력 조회/관리 목적으로 사용됩니다.
 */
@RestController // RESTful API를 위한 컨트롤러임을 선언
// ⭐ RequestMapping 경로: 사용자별 이력을 조회하므로 users/{userId} 하위에 둡니다.
//    관리자 전용이라면 /api/v1/admin/use-hists 등으로 시작할 수도 있습니다.
@RequestMapping("/api/v1/users/{userId}/use-hists")
@CrossOrigin(origins = "*", allowedHeaders = "*") // 개발용 CORS 설정
public class IngredientUseHistController {

    private final IngredientUseHistService ingredientUseHistService;

    @Autowired // 생성자 주입
    public IngredientUseHistController(IngredientUseHistService ingredientUseHistService) {
        this.ingredientUseHistService = ingredientUseHistService;
    }

    /**
     * 특정 사용자의 모든 재료 사용 이력 목록을 조회합니다.
     * GET /api/v1/users/{userId}/use-hists
     * (개발자/관리자용)
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @return 해당 사용자의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<IngredientUseHistListResponseDTO> getIngredientUseHistsByUserId(
            @PathVariable("userId") Long userId) {
        try {
            // TODO: 실제 구현 시 관리자 권한 확인 로직 추가 (예: @PreAuthorize("hasRole('ADMIN')"))
            IngredientUseHistListResponseDTO response = ingredientUseHistService.getIngredientUseHistsByUserId(userId);
            if (response.getUseHists().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT); // 204 No Content
            }
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("재료 사용 이력 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자 재료(`tb_user_ingredient`)에 대한 사용 이력 목록을 조회합니다.
     * GET /api/v1/users/{userId}/use-hists/by-user-ingredient/{userIngredientId}
     * (개발자/관리자용)
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param userIngredientId 경로 변수에서 가져온 사용자 재료 ID
     * @return 해당 사용자 재료의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/by-user-ingredient/{userIngredientId}")
    public ResponseEntity<IngredientUseHistListResponseDTO> getIngredientUseHistsByUserIngredientId(
            @PathVariable("userId") Long userId,
            @PathVariable("userIngredientId") Long userIngredientId) {
        try {
            // TODO: 실제 구현 시 관리자 권한 확인 로직 추가
            IngredientUseHistListResponseDTO response = ingredientUseHistService.getIngredientUseHistsByUserIngredientId(userIngredientId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("특정 사용자 재료 이력 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 특정 레시피에서 사용한 재료 이력을 조회합니다.
     * GET /api/v1/users/{userId}/use-hists/by-recipe/{recipeId}
     * (개발자/관리자용)
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param recipeId 경로 변수에서 가져온 레시피 ID
     * @return 해당 레시피와 사용자 조합의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/by-recipe/{recipeId}")
    public ResponseEntity<IngredientUseHistListResponseDTO> getIngredientUseHistsByRecipeAndUser(
            @PathVariable("userId") Long userId,
            @PathVariable("recipeId") Long recipeId) {
        try {
            // TODO: 실제 구현 시 관리자 권한 확인 로직 추가
            IngredientUseHistListResponseDTO response = ingredientUseHistService.getIngredientUseHistsByRecipeAndUser(userId, recipeId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("레시피별 재료 이력 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 재료 사용 이력 기록을 삭제합니다.
     * DELETE /api/v1/users/{userId}/use-hists/{ingredientUseHistId}
     * (개발자/관리자용)
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param ingredientUseHistId 경로 변수에서 가져온 이력 ID
     * @return HTTP 상태 코드 (204 No Content 또는 404 Not Found)
     */
    @DeleteMapping("/{ingredientUseHistId}")
    public ResponseEntity<Void> deleteIngredientUseHist(
            @PathVariable("userId") Long userId, // TODO: 실제 구현 시 이 userId를 이력의 소유자 확인 등에 활용
            @PathVariable("ingredientUseHistId") Long ingredientUseHistId) {
        try {
            // TODO: 실제 구현 시 관리자 권한 확인 로직 추가 및 삭제 대상 이력의 userId와 path variable의 userId 일치 여부 확인
            boolean deleted = ingredientUseHistService.deleteIngredientUseHist(ingredientUseHistId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (삭제할 대상을 찾지 못함)
            }
        } catch (IllegalArgumentException e) {
            System.err.println("재료 사용 이력 삭제 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("재료 사용 이력 삭제 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 레시피와 관련된 사용자의 모든 재료 이력을 삭제합니다.
     * DELETE /api/v1/users/{userId}/use-hists/by-recipe/{recipeId}
     * (개발자/관리자용)
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param recipeId 경로 변수에서 가져온 레시피 ID
     * @return 삭제된 품목의 총 개수와 HTTP 상태 코드 (200 OK)
     */
    @DeleteMapping("/by-recipe/{recipeId}")
    public ResponseEntity<Integer> deleteIngredientUseHistsByRecipeAndUser(
            @PathVariable("userId") Long userId,
            @PathVariable("recipeId") Long recipeId) {
        try {
            // TODO: 실제 구현 시 관리자 권한 확인 로직 추가
            int deletedCount = ingredientUseHistService.deleteIngredientUseHistsByRecipeAndUser(userId, recipeId);
            return new ResponseEntity<>(deletedCount, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("레시피 관련 재료 이력 일괄 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}