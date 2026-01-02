package com.cucook.moc.recipe.service; // ⭐ recipe 패키지

import com.cucook.moc.recipe.dto.request.RecipeLikeRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeResponseDTO;

import java.util.List; // RecipeLikeListResponseDTO 내부에서 List 사용

/**
 * 사용자 레시피 좋아요 기능과 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 * 마이페이지의 '좋아요한 게시물' 탭 기능을 담당합니다.
 */
public interface RecipeLikeService {

    /**
     * 특정 사용자가 레시피에 '좋아요'를 누르거나 취소(토글)합니다.
     * 이 작업은 tb_recipe_like 테이블에 기록하고 tb_recipe의 like_cnt를 증감시킵니다.
     *
     * @param userId 좋아요를 요청하는 사용자의 ID
     * @param requestDTO 좋아요/취소할 레시피 ID를 포함하는 요청 DTO
     * @return 좋아요 상태 변경 성공 여부 (true/false)
     * @throws IllegalArgumentException 레시피 ID가 유효하지 않을 경우 등
     */
    boolean toggleRecipeLike(Long userId, RecipeLikeRequestDTO requestDTO);

    /**
     * 특정 사용자가 좋아요한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * 마이페이지의 '좋아요한 게시물' 탭의 목록 표시용입니다.
     *
     * @param userId 좋아요 목록을 조회할 사용자의 ID
     * @return 사용자 좋아요 목록과 총 개수를 담은 응답 DTO
     */
    RecipeLikeListResponseDTO getLikedRecipes(Long userId);

    /**
     * 특정 사용자가 특정 레시피에 좋아요를 눌렀는지 여부를 확인합니다.
     * 레시피 상세 화면에서 좋아요 버튼의 UI 상태를 표시하는 데 사용됩니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 좋아요되어 있으면 true, 아니면 false
     */
    boolean isRecipeLiked(Long userId, Long recipeId);

    /**
     * 특정 사용자가 좋아요한 레시피의 총 개수를 조회합니다.
     * 마이페이지 메인 화면의 '좋아요한 게시물' 카드에 표시됩니다.
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 좋아요된 레시피의 총 개수
     */
    int countLikedRecipes(Long userId);
}