package com.cucook.moc.recipe.service.impl; // ⭐ recipe 패키지 아래에 service.impl을 생성

import com.cucook.moc.recipe.dao.RecipeDAO;        // 레시피 상세 정보 조회 및 like_cnt 업데이트용 DAO
import com.cucook.moc.recipe.dao.RecipeLikeDAO;     // 좋아요 DAO
import com.cucook.moc.recipe.dto.request.RecipeLikeRequestDTO;
import com.cucook.moc.recipe.dto.response.LikedRecipeDetailDTO; // DTO 임포트
import com.cucook.moc.recipe.dto.response.RecipeLikeListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeResponseDTO;
import com.cucook.moc.recipe.service.RecipeLikeService; // 인터페이스 구현
import com.cucook.moc.recipe.vo.RecipeLikeVO;      // VO 사용
import com.cucook.moc.recipe.vo.RecipeVO;          // Recipe 상세 조회용 VO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Spring 서비스 컴포넌트로 등록
public class RecipeLikeServiceImpl implements RecipeLikeService {

    private final RecipeLikeDAO recipeLikeDAO;
    private final RecipeDAO recipeDAO; // 레시피 상세 정보 조회 및 like_cnt 업데이트를 위해 주입

    @Autowired // 생성자 주입
    public RecipeLikeServiceImpl(RecipeLikeDAO recipeLikeDAO,
                                 RecipeDAO recipeDAO) {
        this.recipeLikeDAO = recipeLikeDAO;
        this.recipeDAO = recipeDAO;
    }

    /**
     * 특정 사용자가 레시피에 '좋아요'를 누르거나 취소(토글)합니다.
     * 이 작업은 tb_recipe_like 테이블에 기록하고 tb_recipe의 like_cnt를 증감시킵니다.
     *
     * @param userId 좋아요를 요청하는 사용자의 ID
     * @param requestDTO 좋아요/취소할 레시피 ID를 포함하는 요청 DTO
     * @return 좋아요 상태 변경 성공 여부 (true/false)
     * @throws IllegalArgumentException 레시피 ID가 유효하지 않을 경우 등
     */
    @Override
    @Transactional
    public boolean toggleRecipeLike(Long userId, RecipeLikeRequestDTO requestDTO) {
        Long recipeId = requestDTO.getRecipeId();

        // 1. 레시피 존재 여부 확인 (COUNT 쿼리 사용)
        int recipeExists = recipeDAO.selectRecipeExists(recipeId);
        if (recipeExists == 0) {
            throw new IllegalArgumentException("존재하지 않는 레시피입니다. (Recipe ID: " + recipeId + ")");
        }

        // 2. 현재 좋아요 상태 확인
        boolean isCurrentlyLiked =
                recipeLikeDAO.checkIfRecipeIsLiked(userId, recipeId) > 0;

        if (isCurrentlyLiked) {
            // 3. 좋아요 취소
            int deletedCount = recipeLikeDAO.deleteRecipeLike(userId, recipeId);
            if (deletedCount > 0) {
                recipeDAO.decrementRecipeLikeCount(recipeId);
                return false;
            }
        } else {
            // 4. 좋아요 추가
            RecipeLikeVO vo = new RecipeLikeVO();
            vo.setUserId(userId);
            vo.setRecipeId(recipeId);
            vo.setCreatedId(userId);

            int insertedCount = recipeLikeDAO.insertRecipeLike(vo);
            if (insertedCount > 0) {
                recipeDAO.incrementRecipeLikeCount(recipeId);
                return true;
            }
        }

        throw new RuntimeException("좋아요 상태 변경에 실패했습니다.");
    }


    /**
     * 특정 사용자가 좋아요한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * 마이페이지의 '좋아요한 게시물' 탭의 목록 표시용입니다.
     *
     * @param userId 좋아요 목록을 조회할 사용자의 ID
     * @return 사용자 좋아요 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public RecipeLikeListResponseDTO getLikedRecipes(Long userId) {
        // DAO에서 이미 DTO 형태로 조인하여 가져오는 쿼리를 사용
        List<RecipeLikeResponseDTO> dtoList = recipeLikeDAO.selectRecipeLikesWithDetailByUserId(userId);

        // 좋아요한 게시물이므로 모든 항목의 likedByMe를 true로 설정
        dtoList.forEach(dto -> {
            if (dto.getRecipe() != null) {
                dto.getRecipe().setLikedByMe(1); // 1 = true
            }
        });

        // 정렬 순서가 필요하다면 여기서 추가 정렬 가능 (DAO 쿼리에서 이미 created_date DESC로 정렬)

        return new RecipeLikeListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자가 특정 레시피에 좋아요를 눌렀는지 여부를 확인합니다.
     * 레시피 상세 화면에서 좋아요 버튼의 UI 상태를 표시하는 데 사용됩니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 좋아요되어 있으면 true, 아니면 false
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public boolean isRecipeLiked(Long userId, Long recipeId) {
        return recipeLikeDAO.checkIfRecipeIsLiked(userId, recipeId) > 0;
    }

    /**
     * 특정 사용자가 좋아요한 레시피의 총 개수를 조회합니다.
     * 마이페이지 메인 화면의 '좋아요한 게시물' 카드에 표시됩니다.
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 좋아요된 레시피의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countLikedRecipes(Long userId) {
        return recipeLikeDAO.countRecipeLikesByUserId(userId);
    }
}