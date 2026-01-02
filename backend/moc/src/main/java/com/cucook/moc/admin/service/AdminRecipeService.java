package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dto.request.AdminRecipeSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListResponseDTO;

/**
 * 관리자 레시피(게시글) 관리 비즈니스 로직 인터페이스
 */
public interface AdminRecipeService {

    AdminRecipeListResponseDTO getRecipeList(Long adminUserId, AdminRecipeSearchRequestDTO searchDTO);

    void hideRecipe(Long adminUserId, Long recipeId);

    void showRecipe(Long adminUserId, Long recipeId);

    void deleteRecipe(Long adminUserId, Long recipeId); // 소프트 삭제
}
