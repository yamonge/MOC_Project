package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.dto.request.RecipeBookmarkRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkResponseDTO;

/**
 * 사용자 레시피 북마크(저장) 기능과 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 * 마이페이지의 '저장된 게시글' 탭 기능을 담당합니다.
 */
public interface RecipeBookmarkService {

    /**
     * 특정 사용자가 레시피를 북마크(저장)합니다.
     * 이미 저장된 레시피인 경우 아무 동작도 하지 않거나, 성공 메시지를 반환합니다.
     *
     * @param userId 북마크를 요청하는 사용자의 ID
     * @param requestDTO 저장할 레시피 ID를 포함하는 요청 DTO
     * @return 저장된 레시피 정보를 담은 응답 DTO (이미 저장되어 있었다면 기존 정보)
     * @throws IllegalArgumentException 레시피 ID가 유효하지 않거나 이미 저장된 경우 등
     */
    RecipeBookmarkResponseDTO addRecipeBookmark(Long userId, RecipeBookmarkRequestDTO requestDTO);

    /**
     * 특정 사용자가 북마크한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * 마이페이지의 '저장된 게시글' 탭의 목록 표시용입니다.
     *
     * @param userId 북마크 목록을 조회할 사용자의 ID
     * @return 사용자 북마크 목록과 총 개수를 담은 응답 DTO
     */
    RecipeBookmarkListResponseDTO getBookmarkedRecipes(Long userId);

    /**
     * 특정 사용자가 저장한 특정 레시피 북마크를 삭제합니다. (저장 취소)
     *
     * @param userId 북마크 삭제를 요청하는 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 북마크를 찾을 수 없거나 권한이 없을 경우
     */
    boolean deleteRecipeBookmark(Long userId, Long recipeId);

    /**
     * 특정 사용자가 특정 레시피를 북마크했는지 여부를 확인합니다.
     * 레시피 상세 화면에서 저장 버튼의 UI 상태를 표시하는 데 사용됩니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 북마크되어 있으면 true, 아니면 false
     */
    boolean isRecipeBookmarked(Long userId, Long recipeId);

    /**
     * 특정 사용자가 북마크한 레시피의 총 개수를 조회합니다.
     * 마이페이지 메인 화면의 '저장된 게시글' 카드에 표시됩니다.
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 북마크된 레시피의 총 개수
     */
    int countBookmarkedRecipes(Long userId);

    /**
     * 특정 사용자가 저장(북마크)한 레시피 중
     * 게시판에 공개(is_public = 'Y')한 레시피 목록을 조회합니다.
     *
     * 마이페이지의 '공유한 게시글' 탭에 표시되는 목록 조회용 API입니다.
     *
     * @param userId 조회 대상이 되는 사용자의 ID
     * @return 공개된(공유된) 레시피 목록과 총 개수를 담은 응답 DTO
     */
    RecipeBookmarkListResponseDTO getMyPublicRecipes(Long userId);
}