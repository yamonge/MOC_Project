package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeReportVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RecipeReportRepository extends JpaRepository<RecipeReportVO, Long> {

    List<RecipeReportVO> findByReporterUserId(Long reporterUserId);

    int countByReporterUserId(Long reporterUserId);

    boolean existsByRecipeIdAndReporterUserId(Long recipeId, Long reporterUserId);

    @Modifying
    @Transactional
    @Query("DELETE FROM RecipeReportVO r WHERE r.reportId = :reportId AND r.reporterUserId = :reporterUserId")
    int deleteByReportIdAndReporterUserId(@Param("reportId") Long reportId,
                                          @Param("reporterUserId") Long reporterUserId);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeReportVO r SET r.statusCd = :statusCd WHERE r.reportId = :recipeReportId")
    int updateRecipeReportStatus(@Param("recipeReportId") Long recipeReportId,
                                  @Param("statusCd") String statusCd);
}
