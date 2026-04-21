package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.vo.AdminRecipeVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminRecipeDAO extends JpaRepository<RecipeVO, Long> {

    @Query(value = "SELECT " +
            "r.recipe_id AS recipeId, " +
            "r.title AS title, " +
            "r.is_public AS isPublic, " +
            "r.is_deleted AS isDeleted, " +
            "r.report_cnt AS reportCnt, " +
            "r.created_date AS createdDate, " +
            "u.user_nickname AS ownerNickname " +
            "FROM tb_recipe r " +
            "LEFT JOIN tb_user u ON u.user_id = r.owner_user_id " +
            "WHERE r.is_deleted = 'N' " +
            "AND (:status IS NULL OR :status = '' " +
            "  OR (:status = 'public' AND r.is_public = 'Y') " +
            "  OR (:status = 'hidden' AND r.is_public = 'N')) " +
            "AND (:search IS NULL OR :search = '' " +
            "  OR LOWER(r.title) LIKE CONCAT('%', LOWER(:search), '%') " +
            "  OR LOWER(u.user_nickname) LIKE CONCAT('%', LOWER(:search), '%')) " +
            "ORDER BY r.recipe_id DESC", nativeQuery = true)
    List<AdminRecipeVO> selectAdminRecipeList(@Param("status") String status,
                                              @Param("search") String search);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeVO r SET r.isPublic = :isPublic, r.updatedId = :adminUserId, " +
            "r.updatedDate = CURRENT_TIMESTAMP " +
            "WHERE r.recipeId = :recipeId AND r.isDeleted = 'N'")
    int updateRecipeVisibility(@Param("recipeId") Long recipeId,
                               @Param("isPublic") String isPublic,
                               @Param("adminUserId") Long adminUserId);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeVO r SET r.isDeleted = 'Y', r.updatedId = :adminUserId, " +
            "r.updatedDate = CURRENT_TIMESTAMP " +
            "WHERE r.recipeId = :recipeId AND r.isDeleted = 'N'")
    int softDeleteRecipe(@Param("recipeId") Long recipeId,
                         @Param("adminUserId") Long adminUserId);
}
