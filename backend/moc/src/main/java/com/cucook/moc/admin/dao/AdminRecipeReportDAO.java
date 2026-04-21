package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.vo.AdminRecipeReportVO;
import com.cucook.moc.recipe.vo.RecipeReportVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminRecipeReportDAO extends JpaRepository<RecipeReportVO, Long> {

    @Query(value = "SELECT " +
            "r.recipe_report_id AS recipeReportId, " +
            "r.recipe_id AS recipeId, " +
            "r.reporter_user_id AS reporterUserId, " +
            "u1.user_nickname AS reporterNickname, " +
            "r.report_reason_cd AS reportReasonCd, " +
            "r.content AS content, " +
            "r.status_cd AS statusCd, " +
            "r.created_date AS createdDate, " +
            "r.updated_date AS updatedDate, " +
            "rec.title AS recipeTitle, " +
            "rec.owner_user_id AS recipeOwnerUserId, " +
            "u2.user_nickname AS recipeOwnerNickname " +
            "FROM tb_recipe_report r " +
            "JOIN tb_user u1 ON u1.user_id = r.reporter_user_id " +
            "LEFT JOIN tb_recipe rec ON rec.recipe_id = r.recipe_id " +
            "LEFT JOIN tb_user u2 ON u2.user_id = rec.owner_user_id " +
            "WHERE (rec.is_deleted IS NULL OR rec.is_deleted = 'N') " +
            "AND (:reasonCd IS NULL OR :reasonCd = '' OR r.report_reason_cd = :reasonCd) " +
            "AND (:statusCd IS NULL OR :statusCd = '' OR :statusCd = 'ALL' " +
            "  OR (:statusCd = 'PROCESSED' AND r.status_cd IN ('APPROVED', 'REJECTED')) " +
            "  OR (:statusCd != 'PROCESSED' AND r.status_cd = :statusCd)) " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "  OR u1.user_nickname LIKE CONCAT('%', :keyword, '%') " +
            "  OR rec.title LIKE CONCAT('%', :keyword, '%') " +
            "  OR u2.user_nickname LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:lastRecipeReportId IS NULL OR r.recipe_report_id < :lastRecipeReportId) " +
            "ORDER BY r.recipe_report_id DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<AdminRecipeReportVO> selectRecipeReportList(@Param("reasonCd") String reasonCd,
                                                      @Param("statusCd") String statusCd,
                                                      @Param("keyword") String keyword,
                                                      @Param("lastRecipeReportId") Long lastRecipeReportId,
                                                      @Param("limit") Integer limit);
}
