package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeLikeVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

public interface RecipeLikeRepository extends JpaRepository<RecipeLikeVO, Long> {

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    int countByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM RecipeLikeVO rl WHERE rl.userId = :userId AND rl.recipeId = :recipeId")
    int deleteByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    @Query(value =
            "SELECT rl.recipe_like_id AS likeId, " +
            "       rl.recipe_id      AS recipeId, " +
            "       rl.user_id        AS userId, " +
            "       rl.created_date   AS createdDate, " +
            "       r.recipe_id       AS recipePkId, " +
            "       r.title           AS recipeTitle, " +
            "       r.summary         AS summary, " +
            "       r.thumbnail_url   AS thumbnailUrl, " +
            "       r.difficulty_cd   AS difficultyCd, " +
            "       r.cook_time_min   AS cookTimeMin, " +
            "       r.cuisine_style_cd AS cuisineStyleCd, " +
            "       r.view_cnt        AS viewCnt, " +
            "       r.like_cnt        AS likeCnt, " +
            "       u.user_nickname   AS authorNickname " +
            "FROM tb_recipe_like rl " +
            "JOIN tb_recipe r ON rl.recipe_id = r.recipe_id " +
            "JOIN tb_user u   ON r.owner_user_id = u.user_id " +
            "WHERE rl.user_id = :userId " +
            "ORDER BY rl.created_date DESC",
            nativeQuery = true)
    List<RecipeLikeDetailProjection> findLikesWithDetailByUserId(@Param("userId") Long userId);

    interface RecipeLikeDetailProjection {
        Long getLikeId();
        Long getRecipeId();
        Long getUserId();
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
