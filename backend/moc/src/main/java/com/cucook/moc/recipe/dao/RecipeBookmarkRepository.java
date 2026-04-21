package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeBookmarkVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmarkVO, Long> {

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    int countByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM RecipeBookmarkVO b WHERE b.userId = :userId AND b.recipeId = :recipeId")
    int deleteByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    @Query(value =
            "SELECT rb.recipe_bookmark_id AS bookmarkId, " +
            "       rb.user_id            AS userId, " +
            "       rb.recipe_id          AS recipeId, " +
            "       rb.created_date       AS createdDate, " +
            "       r.recipe_id           AS recipePkId, " +
            "       r.title               AS recipeTitle, " +
            "       r.summary             AS summary, " +
            "       r.thumbnail_url       AS thumbnailUrl, " +
            "       r.difficulty_cd       AS difficultyCd, " +
            "       r.cook_time_min       AS cookTimeMin, " +
            "       r.cuisine_style_cd    AS cuisineStyleCd, " +
            "       r.view_cnt            AS viewCnt, " +
            "       r.like_cnt            AS likeCnt, " +
            "       u.user_nickname       AS authorNickname " +
            "FROM tb_recipe_bookmark rb " +
            "JOIN tb_recipe r ON rb.recipe_id = r.recipe_id " +
            "LEFT JOIN tb_user u ON r.owner_user_id = u.user_id " +
            "WHERE rb.user_id = :userId AND u.user_status = 'ACTIVE' " +

            "UNION ALL " +

            "SELECT NULL                  AS bookmarkId, " +
            "       r2.owner_user_id      AS userId, " +
            "       r2.recipe_id          AS recipeId, " +
            "       r2.created_date       AS createdDate, " +
            "       r2.recipe_id          AS recipePkId, " +
            "       r2.title              AS recipeTitle, " +
            "       r2.summary            AS summary, " +
            "       r2.thumbnail_url      AS thumbnailUrl, " +
            "       r2.difficulty_cd      AS difficultyCd, " +
            "       r2.cook_time_min      AS cookTimeMin, " +
            "       r2.cuisine_style_cd   AS cuisineStyleCd, " +
            "       r2.view_cnt           AS viewCnt, " +
            "       r2.like_cnt           AS likeCnt, " +
            "       u2.user_nickname      AS authorNickname " +
            "FROM tb_recipe r2 " +
            "LEFT JOIN tb_user u2 ON r2.owner_user_id = u2.user_id " +
            "WHERE r2.owner_user_id = :userId " +
            "  AND r2.is_deleted = 'N' " +
            "  AND u2.user_status = 'ACTIVE' " +
            "  AND NOT EXISTS ( " +
            "      SELECT 1 FROM tb_recipe_bookmark rb2 " +
            "      WHERE rb2.recipe_id = r2.recipe_id AND rb2.user_id = :userId " +
            "  ) " +
            "ORDER BY createdDate DESC",
            nativeQuery = true)
    List<RecipeBookmarkDetailProjection> findBookmarksWithDetailByUserId(@Param("userId") Long userId);

    interface RecipeBookmarkDetailProjection {
        Long getBookmarkId();
        Long getUserId();
        Long getRecipeId();
        Timestamp getCreatedDate();
        Long getRecipePkId();
        String getRecipeTitle();
        String getSummary();
        String getThumbnailUrl();
        String getDifficultyCd();
        Integer getCookTimeMin();
        String getCuisineStyleCd();
        Integer getViewCnt();
        Integer getLikeCnt();
        String getAuthorNickname();
    }
}
