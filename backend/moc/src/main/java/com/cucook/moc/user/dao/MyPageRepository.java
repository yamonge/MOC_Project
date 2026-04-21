package com.cucook.moc.user.dao;

import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import com.cucook.moc.user.vo.UserVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MyPageRepository extends JpaRepository<UserVO, Long> {

    @Query(value = "SELECT COUNT(*) FROM tb_user_ingredient WHERE user_id = :userId", nativeQuery = true)
    int countUserIngredients(@Param("userId") Long userId);

    @Query(value = "SELECT " +
           "(SELECT COUNT(*) FROM tb_recipe WHERE owner_user_id = :userId AND is_deleted = 'N') + " +
           "(SELECT COUNT(*) FROM tb_recipe_like WHERE user_id = :userId)", nativeQuery = true)
    int countSavedRecipes(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM tb_recipe WHERE owner_user_id = :userId AND is_public = 'Y' AND is_deleted = 'N'", nativeQuery = true)
    int countSharedRecipes(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM tb_user_review WHERE target_user_id = :userId", nativeQuery = true)
    int countReceivedReviews(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM (" +
           "SELECT recipe_report_id FROM tb_recipe_report WHERE reporter_user_id = :userId " +
           "UNION ALL " +
           "SELECT user_report_id FROM tb_user_report WHERE reporter_user_id = :userId" +
           ") AS combined", nativeQuery = true)
    int countMyReports(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(DISTINCT sp.shopping_post_id) " +
           "FROM tb_shopping_participant p " +
           "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
           "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
           "WHERE p.user_id = :userId AND sp.status_cd = 'DONE' AND p.leave_date IS NULL", nativeQuery = true)
    int countCompletedMeetings(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(DISTINCT sp.shopping_post_id) " +
           "FROM tb_shopping_participant p " +
           "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
           "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
           "WHERE p.user_id = :userId AND p.leave_date IS NULL", nativeQuery = true)
    int countTotalMeetings(@Param("userId") Long userId);

    @Query(value =
           "SELECT 'RECIPE' AS reportType, RR.recipe_report_id AS reportId, " +
           "R.title AS title, U.user_nickname AS targetName, " +
           "RR.report_reason_cd AS reportReasonCd, RR.content AS reportContent, " +
           "RR.status_cd AS statusCd, RR.created_date AS createdDate " +
           "FROM tb_recipe_report RR " +
           "LEFT JOIN tb_recipe R ON R.recipe_id = RR.recipe_id " +
           "LEFT JOIN tb_user U ON U.user_id = R.owner_user_id " +
           "WHERE RR.reporter_user_id = :userId " +
           "UNION ALL " +
           "SELECT 'USER' AS reportType, UR.user_report_id AS reportId, " +
           "U.user_nickname AS title, U.user_nickname AS targetName, " +
           "UR.report_reason_cd AS reportReasonCd, UR.report_comment AS reportContent, " +
           "UR.processing_status_cd AS statusCd, UR.created_date AS createdDate " +
           "FROM tb_user_report UR " +
           "LEFT JOIN tb_user U ON U.user_id = UR.reported_user_id " +
           "WHERE UR.reporter_user_id = :userId " +
           "ORDER BY createdDate DESC", nativeQuery = true)
    List<MyPageReportItemDTO> selectMyReportHistory(@Param("userId") Long userId);
}
