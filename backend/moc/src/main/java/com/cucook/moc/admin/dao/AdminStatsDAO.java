package com.cucook.moc.admin.dao;

import com.cucook.moc.user.vo.UserVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdminStatsDAO extends JpaRepository<UserVO, Long> {

    @Query(value = "SELECT COUNT(*) FROM tb_user " +
            "WHERE COALESCE(UPPER(user_status), 'ACTIVE') != 'WITHDRAW' " +
            "AND UPPER(user_type) != 'Y'", nativeQuery = true)
    int countNonWithdrawUsers();

    @Query(value = "SELECT COUNT(*) FROM tb_user_report " +
            "WHERE UPPER(processing_status_cd) = 'PENDING'", nativeQuery = true)
    int countPendingUserReports();

    @Query(value = "SELECT COUNT(*) FROM tb_recipe_report " +
            "WHERE UPPER(status_cd) = 'PENDING'", nativeQuery = true)
    int countPendingRecipeReports();

    @Query(value = "SELECT COUNT(*) FROM tb_user " +
            "WHERE user_id = :adminUserId AND user_type = 'Y'", nativeQuery = true)
    int isAdminUser(@Param("adminUserId") Long adminUserId);
}
