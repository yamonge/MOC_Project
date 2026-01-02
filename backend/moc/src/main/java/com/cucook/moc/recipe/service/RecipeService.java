package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.dto.request.RecipeGenerationRequestDTO;
import com.cucook.moc.recipe.dto.request.RecipeSaveRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeRecommendationResponseDTO; // DTO 이름 유지
import com.cucook.moc.recipe.dto.response.RecipeResponseDTO; // 단일 레시피 응답 DTO
import com.cucook.moc.recipe.dto.response.RecipeListResponseDTO; // 레시피 목록 응답 DTO (공유 레시피 목록에 사용)

import java.util.List;

/**
 * AI 레시피 추천 및 레시피 메인 정보 관련 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 */
public interface RecipeService {

    /**
     * AI 레시피 추천 워크플로우를 실행하여 사용자에게 레시피를 추천합니다.
     * @param requestDTO 사용자 선택 재료 및 필터 조건을 포함하는 요청 DTO
     * @return AI가 추천한 레시피 목록을 포함하는 응답 DTO
     */
    RecipeRecommendationResponseDTO recommendRecipes(RecipeGenerationRequestDTO requestDTO);

    // ⭐ 새로 추가되는 메서드들 (공유한 게시글 기능) ⭐

    /**
     * 특정 레시피의 공개(`is_public`) 상태를 업데이트(토글)합니다.
     * 사용자가 자신의 레시피를 '공유'하거나 '공유 취소'하는 것으로 간주합니다.
     *
     * @param recipeId 상태를 업데이트할 레시피의 ID
     * @param userId 해당 레시피의 소유자 ID (권한 확인용)
     * @param shareStatus 공유 여부 (true: 공개, false: 비공개)
     * @return 업데이트 성공 여부 (true/false)
     * @throws IllegalArgumentException 레시피를 찾을 수 없거나 권한이 없을 경우
     */
    boolean toggleRecipeShareStatus(Long recipeId, Long userId, boolean shareStatus);

    /**
     * 특정 사용자가 '공유'(공개)한 모든 레시피 목록을 조회합니다.
     * 마이페이지 '공유한 게시글' 탭의 목록 표시용입니다.
     *
     * @param userId 공유한 레시피 목록을 조회할 사용자의 ID
     * @return 해당 사용자가 공유한 레시피 목록과 총 개수를 담은 응답 DTO
     */
    RecipeListResponseDTO getSharedRecipesByUserId(Long userId);

    /**
     * 특정 사용자가 '공유'(공개)한 레시피의 총 개수를 조회합니다.
     * 마이페이지 '공유한 게시글' 카드에 표시용입니다.
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 공유된 레시피의 총 개수
     */
    int countSharedRecipesByUserId(Long userId);


    /**
     * 사용자가 선택한 레시피를 DB에 저장합니다.
     *
     * @param userId 레시피를 저장하는 사용자 ID
     * @param dto 저장할 레시피 정보
     * @return 생성된 recipeId
     */
    Long saveRecipe(Long userId, RecipeSaveRequestDTO dto);
}