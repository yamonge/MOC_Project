package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeBookmarkVO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RecipeBookmarkDAO {

    /**
     * 레시피 북마크 정보를 데이터베이스에 저장합니다.
     * `recipeBookmarkMapper.xml`의 `<insert id="insertRecipeBookmark">`와 매핑됩니다.
     *
     * @param vo 저장할 RecipeBookmarkVO 객체 (user_id, recipe_id, created_id 포함)
     * @return 삽입된 레코드 수
     */
    int insertRecipeBookmark(RecipeBookmarkVO vo);

    /**
     * 특정 사용자가 저장한 특정 레시피 북마크를 삭제합니다.
     * `recipeBookmarkMapper.xml`의 `<delete id="deleteRecipeBookmark">`와 매핑됩니다.
     * `parameterType="map"`을 사용하므로, `Map` 또는 `@Param` 어노테이션을 사용하여 파라미터를 전달합니다.
     * `@Param` 사용 시 Map을 생성할 필요 없이 명확합니다.
     *
     * @param userId 삭제를 요청하는 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제된 레코드 수
     */
    int deleteRecipeBookmark(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    /**
     * 특정 사용자가 북마크한 모든 레시피 목록을 상세 정보와 함께 조회합니다.
     * `recipeBookmarkMapper.xml`의 `<select id="selectRecipeBookmarksWithDetailByUserId">`와 매핑됩니다.
     * `resultMap="RecipeBookmarkDetailResultMap"`을 통해 `RecipeBookmarkResponseDTO`에 매핑됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 북마크된 레시피 상세 정보 리스트
     */
    List<RecipeBookmarkResponseDTO> selectRecipeBookmarksWithDetailByUserId(Long userId);

    /**
     * 특정 사용자가 북마크한 레시피의 총 개수를 조회합니다.
     * `recipeBookmarkMapper.xml`의 `<select id="countRecipeBookmarksByUserId">`와 매핑됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 북마크된 레시피의 총 개수
     */
    int countRecipeBookmarksByUserId(Long userId);

    /**
     * 특정 사용자가 특정 레시피를 북마크했는지 여부를 확인합니다.
     * `recipeBookmarkMapper.xml`의 `<select id="checkIfRecipeIsBookmarked">`와 매핑됩니다.
     * `@Param` 사용 시 Map을 생성할 필요 없이 명확합니다.
     *
     * @param userId 확인을 요청하는 사용자의 ID
     * @param recipeId 확인할 레시피의 ID
     * @return 해당 레시피가 북마크되어 있으면 1, 아니면 0
     */
    int checkIfRecipeIsBookmarked(@Param("userId") Long userId, @Param("recipeId") Long recipeId);
}