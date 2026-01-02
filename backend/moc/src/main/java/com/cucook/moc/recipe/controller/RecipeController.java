package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.dto.request.RecipeGenerationRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeRecommendationResponseDTO;
import com.cucook.moc.recipe.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AI 레시피 추천 요청을 처리하는 REST 컨트롤러입니다.
 * 클라이언트로부터 사용자 선택 재료 및 필터 조건을 받아 AI 레시피 추천 워크플로우를 시작합니다.
 */
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    // 생성자 주입을 통해 RecipeService 의존성 주입
    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    /**
     * AI 레시피 추천을 요청하는 엔드포인트입니다.
     * 클라이언트로부터 JSON 형식의 RecipeGenerationRequestDTO를 받아
     * AI 레시피 추천 로직을 실행하고 결과를 반환합니다.
     *
     * HTTP POST 요청을 통해 /api/v1/recipes/recommend 경로로 접근합니다.
     *
     * @param requestDTO 사용자 선택 재료 및 필터 조건을 포함하는 요청 DTO
     * @return AI가 추천한 레시피 목록을 포함하는 응답 DTO와 HTTP 상태 코드
     */
    @PostMapping("/recommend")
    public ResponseEntity<RecipeRecommendationResponseDTO> recommendRecipes(@RequestBody RecipeGenerationRequestDTO requestDTO) {
        try {
            // 서비스 계층의 레시피 추천 로직 호출
            System.out.println("30");
            RecipeRecommendationResponseDTO response = recipeService.recommendRecipes(requestDTO);

            // 성공적으로 레시피가 생성되었는지 확인
            if ("SUCCESS".equals(response.getStatus()) && !response.getRecommendedRecipes().isEmpty()) {
                System.out.println("31");
                return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK

            } else if ("SUCCESS".equals(response.getStatus()) && response.getRecommendedRecipes().isEmpty()) {
                // 레시피가 생성되었지만, 조건에 맞는 레시피가 없거나 저장 중 오류로 인해 결과가 비어있을 경우
                System.out.println("32");
                return new ResponseEntity<>(new RecipeRecommendationResponseDTO(
                        null, "NO_CONTENT", "조건에 맞는 레시피를 찾을 수 없습니다."), HttpStatus.NO_CONTENT); // 204 No Content
            } else {
                System.out.println("33");
                // 서비스 내부에서 오류가 발생했으나 예외로 던지지 않고 response.status에 담아 반환하는 경우
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            }
        } catch (Exception e) {
            // 예기치 않은 오류 발생 시
            System.err.println("레시피 추천 중 예외 발생: " + e.getMessage());
            e.printStackTrace(); // 개발 중에는 스택 트레이스 출력
            return new ResponseEntity<>(new RecipeRecommendationResponseDTO(
                    null, "ERROR", "레시피 추천 서비스 중 예기치 않은 오류가 발생했습니다: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}
