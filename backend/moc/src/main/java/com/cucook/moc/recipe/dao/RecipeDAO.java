package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param; // 복수 파라미터 매핑을 위해 @Param 사용

import java.util.List;

@Mapper
public interface RecipeDAO {

    /**
     * 레시피의 메인 정보를 데이터베이스에 저장합니다.
     *
     * @param vo 저장할 RecipeVO 객체
     * @return 삽입된 레코드 수
     */
    int insertRecipe(RecipeVO vo);

    /**
     * 특정 레시피 ID를 통해 단일 레시피의 상세 정보를 조회합니다.
     *
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피의 RecipeVO 객체 또는 null
     */
    RecipeVO selectRecipeById(Long recipeId);

    /**
     * 다양한 검색 조건에 따라 레시피 목록을 조회합니다.
     *
     * @param vo 검색 조건을 담은 RecipeVO 객체
     * @return 검색 조건에 맞는 RecipeVO 리스트
     */
    List<RecipeVO> selectRecipesByCriteria(RecipeVO vo);

    /**
     * `tb_recipe` 테이블의 `like_cnt`를 1 증가시킵니다.
     *
     * @param recipeId 좋아요 수를 증가시킬 레시피의 ID
     * @return 업데이트된 레코드 수
     */
    int incrementRecipeLikeCount(Long recipeId);

    /**
     * `tb_recipe` 테이블의 `like_cnt`를 1 감소시킵니다. (최소 0)
     *
     * @param recipeId 좋아요 수를 감소시킬 레시피의 ID
     * @return 업데이트된 레코드 수
     */
    int decrementRecipeLikeCount(Long recipeId);

    // ⭐ 새로 추가되는 메서드들 (공유한 게시글 기능) ⭐

    /**
     * 특정 레시피의 공개(`is_public`) 상태를 업데이트합니다.
     * 사용자가 자신의 레시피를 '공유'하는 것으로 간주합니다.
     *
     * @param recipeId 상태를 업데이트할 레시피의 ID
     * @param userId 해당 레시피의 소유자 ID (권한 확인용)
     * @param isPublicFlag 'Y' 또는 'N' (공개 여부)
     * @return 업데이트된 레코드 수
     */
    int updateRecipeIsPublic(
            @Param("recipeId") Long recipeId,
            @Param("userId") Long userId,
            @Param("isPublicFlag") String isPublicFlag
    );

    /**
     * 특정 사용자가 '공유'(공개)한 모든 레시피 목록을 조회합니다.
     * (마이페이지 '공유한 게시글' 탭의 목록 표시용)
     *
     * @param userId 공유한 레시피 목록을 조회할 사용자의 ID
     * @return 해당 사용자가 공유한 RecipeVO 리스트 (is_public = 'Y'인 레시피만)
     */
    List<RecipeVO> selectSharedRecipesByUserId(Long userId);

    /**
     * 특정 사용자가 '공유'(공개)한 레시피의 총 개수를 조회합니다.
     * (마이페이지 '공유한 게시글' 카드에 표시용)
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 공유된 레시피의 총 개수
     */
    int countSharedRecipesByUserId(Long userId);

    /**
     * 레시피 존재 여부 확인
     *
     * @param recipeId 레시피 ID
     * @return 존재하면 1 이상, 없으면 0
     */
    int selectRecipeExists(Long recipeId);

    /**
     * 특정 사용자가 저장한 레시피 중
     * 게시판에 공개(is_public = 'Y')된 레시피 목록을 조회합니다.
     *
     * tb_recipe 테이블을 기준으로 조회하며,
     * owner_user_id가 주어진 userId와 일치하는 레시피만 반환합니다.
     *
     * 마이페이지의 '공유한 게시글' 목록 조회 시 사용됩니다.
     *
     * @param userId 레시피 소유자(저장한 사용자)의 ID
     * @return 공개된 레시피(RecipeVO) 목록
     */
    List<RecipeVO> selectMyPublicRecipes(@Param("userId") Long userId);
}