package com.cucook.moc.recipe.dao; // ⭐ recipe 패키지 아래에 dao를 생성

import com.cucook.moc.recipe.vo.RecipeLikeVO; // VO 임포트
import com.cucook.moc.recipe.dto.response.RecipeLikeResponseDTO; // DTO 임포트 (조회 결과용)
import org.apache.ibatis.annotations.Mapper; // `@Mapper` 어노테이션
import org.apache.ibatis.annotations.Param; // 복수 파라미터 매핑을 위해 `@Param` 사용

import java.util.List;
import java.util.Map;

@Mapper
public interface RecipeLikeDAO {

    /**
     * 레시피 좋아요 정보를 데이터베이스에 저장합니다.
     * `RecipeLikeMapper.xml`의 `<insert id="insertRecipeLike">`와 매핑됩니다.
     *
     * @param vo 저장할 RecipeLikeVO 객체 (recipeId, userId, createdId 포함)
     * @return 삽입된 레코드 수
     */
    int insertRecipeLike(RecipeLikeVO vo);

    /**
     * 특정 사용자가 좋아요한 특정 레시피 좋아요를 삭제합니다. (좋아요 취소 기능)
     * `RecipeLikeMapper.xml`의 `<delete id="deleteRecipeLike">`와 매핑됩니다.
     *
     * @param userId 삭제를 요청하는 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제된 레코드 수
     */
    int deleteRecipeLike(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    /**
     * 특정 사용자가 좋아요한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * `RecipeLikeMapper.xml`의 `<select id="selectRecipeLikesWithDetailByUserId">`와 매핑됩니다.
     * `resultMap="RecipeLikeDetailResultMap"`을 통해 `RecipeLikeResponseDTO`에 매핑됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 좋아요한 레시피 상세 정보 리스트
     */
    List<RecipeLikeResponseDTO> selectRecipeLikesWithDetailByUserId(Long userId);

    /**
     * 특정 사용자가 좋아요한 레시피의 총 개수를 조회합니다.
     * `RecipeLikeMapper.xml`의 `<select id="countRecipeLikesByUserId">`와 매핑됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 좋아요한 레시피의 총 개수
     */
    int countRecipeLikesByUserId(Long userId);

    /**
     * 특정 사용자가 특정 레시피에 좋아요를 눌렀는지 여부를 확인합니다.
     * `RecipeLikeMapper.xml`의 `<select id="checkIfRecipeIsLiked">`와 매핑됩니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 해당 레시피가 좋아요되어 있으면 1, 아니면 0
     */
    int checkIfRecipeIsLiked(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    /**
     * `tb_recipe` 테이블의 `like_cnt`를 1 증가시킵니다.
     * `RecipeLikeMapper.xml`의 `<update id="incrementRecipeLikeCount">`와 매핑됩니다.
     *
     * @param recipeId 좋아요 수를 증가시킬 레시피의 ID
     * @return 업데이트된 레코드 수
     */
    int incrementRecipeLikeCount(Long recipeId);

    /**
     * `tb_recipe` 테이블의 `like_cnt`를 1 감소시킵니다. (최소 0)
     * `RecipeLikeMapper.xml`의 `<update id="decrementRecipeLikeCount">`와 매핑됩니다.
     *
     * @param recipeId 좋아요 수를 감소시킬 레시피의 ID
     * @return 업데이트된 레코드 수
     */
    int decrementRecipeLikeCount(Long recipeId);
}