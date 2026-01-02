package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeBookmarkDAO; // 북마크 DAO
import com.cucook.moc.recipe.dao.RecipeDAO;        // 레시피 상세 정보 조회용 DAO
import com.cucook.moc.recipe.dto.request.RecipeBookmarkRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkResponseDTO;
import com.cucook.moc.recipe.service.RecipeBookmarkService; // 인터페이스 구현
import com.cucook.moc.recipe.vo.RecipeBookmarkVO; // VO 사용
import com.cucook.moc.recipe.vo.RecipeVO; // Recipe 상세 조회용 VO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeBookmarkServiceImpl implements RecipeBookmarkService {

    private final RecipeBookmarkDAO recipeBookmarkDAO;
    private final RecipeDAO recipeDAO;

    @Autowired // 생성자 주입
    public RecipeBookmarkServiceImpl(RecipeBookmarkDAO recipeBookmarkDAO,
                                     RecipeDAO recipeDAO) {
        this.recipeBookmarkDAO = recipeBookmarkDAO;
        this.recipeDAO = recipeDAO;
    }

    /**
     * 특정 사용자가 레시피를 북마크(저장)합니다.
     * 이미 저장된 레시피인 경우 아무 동작도 하지 않거나, 성공 메시지를 반환합니다.
     *
     * @param userId 북마크를 요청하는 사용자의 ID
     * @param requestDTO 저장할 레시피 ID를 포함하는 요청 DTO
     * @return 저장된 레시피 정보를 담은 응답 DTO (이미 저장되어 있었다면 기존 정보)
     * @throws IllegalArgumentException 레시피 ID가 유효하지 않거나 이미 저장된 경우 등
     */
    @Override
    @Transactional
    public RecipeBookmarkResponseDTO addRecipeBookmark(Long userId, RecipeBookmarkRequestDTO requestDTO) {
        Long recipeId = requestDTO.getRecipeId();

        RecipeVO recipe = recipeDAO.selectRecipeById(recipeId);
        if (recipe == null) {
            throw new IllegalArgumentException("존재하지 않는 레시피입니다. (Recipe ID: " + recipeId + ")");
        }

        if (recipeBookmarkDAO.checkIfRecipeIsBookmarked(userId, recipeId) > 0) {
            System.out.println("레시피 (ID: " + recipeId + ")는 이미 사용자 (ID: " + userId + ")에 의해 북마크되어 있습니다.");
        }

        RecipeBookmarkVO vo = new RecipeBookmarkVO();
        vo.setUserId(userId);
        vo.setRecipeId(recipeId);
        vo.setCreatedId(userId);

        // 4. DB에 저장
        int insertedCount = recipeBookmarkDAO.insertRecipeBookmark(vo);
        if (insertedCount == 0 || vo.getBookmarkId() == null) {
            throw new RuntimeException("레시피 북마크 저장에 실패했습니다. (DB 오류)");
        }

        return RecipeBookmarkResponseDTO.from(vo, recipe); // 편의 메서드 사용
    }

    /**
     * 특정 사용자가 북마크한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * @param userId 북마크 목록을 조회할 사용자의 ID
     * @return 사용자 북마크 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true)
    public RecipeBookmarkListResponseDTO getBookmarkedRecipes(Long userId) {
        List<RecipeBookmarkResponseDTO> dtoList = recipeBookmarkDAO.selectRecipeBookmarksWithDetailByUserId(userId);

        return new RecipeBookmarkListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자가 저장한 특정 레시피 북마크를 삭제합니다. (저장 취소)
     *
     * @param userId 북마크 삭제를 요청하는 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 북마크를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional
    public boolean deleteRecipeBookmark(Long userId, Long recipeId) {
        if (recipeBookmarkDAO.checkIfRecipeIsBookmarked(userId, recipeId) == 0) {
            throw new IllegalArgumentException("사용자(ID: " + userId + ")가 북마크하지 않았거나 존재하지 않는 레시피(ID: " + recipeId + ")입니다.");
        }

        int deletedCount = recipeBookmarkDAO.deleteRecipeBookmark(userId, recipeId);
        return deletedCount > 0;
    }

    /**
     * 특정 사용자가 특정 레시피를 북마크했는지 여부를 확인합니다.
     * 레시피 상세 화면에서 저장 버튼의 UI 상태를 표시하는 데 사용됩니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 북마크되어 있으면 true, 아니면 false
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public boolean isRecipeBookmarked(Long userId, Long recipeId) {
        return recipeBookmarkDAO.checkIfRecipeIsBookmarked(userId, recipeId) > 0;
    }

    /**
     * 특정 사용자가 북마크한 레시피의 총 개수를 조회합니다.
     * 마이페이지 메인 화면의 '저장된 게시글' 카드에 표시됩니다.
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 북마크된 레시피의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countBookmarkedRecipes(Long userId) {
        return recipeBookmarkDAO.countRecipeBookmarksByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeBookmarkListResponseDTO getMyPublicRecipes(Long userId) {

        List<RecipeVO> recipes =
                recipeDAO.selectMyPublicRecipes(userId);

        // 기존에 "RecipeVO → RecipeBookmarkResponseDTO" 변환 로직 있으면 그대로 재사용
        List<RecipeBookmarkResponseDTO> list =
                recipes.stream()
                        .map(RecipeBookmarkResponseDTO::fromRecipe)
                        .toList();

        return new RecipeBookmarkListResponseDTO(list, list.size());
    }
}