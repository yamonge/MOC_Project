package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.vo.AdminUserVO;
import com.cucook.moc.user.vo.UserVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

public interface AdminUserDAO extends JpaRepository<UserVO, Long> {

    @Query(value = "SELECT " +
            "u.user_id AS userId, " +
            "u.user_email AS userEmail, " +
            "u.user_name AS userName, " +
            "u.user_nickname AS userNickname, " +
            "u.user_type AS userType, " +
            "u.user_status AS userStatus, " +
            "u.reported_cnt AS reportedCnt, " +
            "u.suspended_until AS suspendedUntil, " +
            "u.suspended_reason AS suspendedReason, " +
            "u.created_date AS createdDate " +
            "FROM tb_user u " +
            "WHERE u.user_type = 'N' " +
            "AND u.user_status != 'WITHDRAW' " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "  OR u.user_email LIKE CONCAT('%', :keyword, '%') " +
            "  OR u.user_nickname LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:status IS NULL OR :status = '' OR :status = 'ALL' OR u.user_status = :status) " +
            "AND (:lastUserId IS NULL OR u.user_id < :lastUserId) " +
            "ORDER BY u.user_id DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<AdminUserVO> selectAdminUserList(@Param("keyword") String keyword,
                                          @Param("status") String status,
                                          @Param("lastUserId") Long lastUserId,
                                          @Param("limit") Integer limit);

    @Query(value = "SELECT " +
            "u.user_id AS userId, " +
            "u.user_email AS userEmail, " +
            "u.user_name AS userName, " +
            "u.user_nickname AS userNickname, " +
            "u.user_type AS userType, " +
            "u.user_status AS userStatus, " +
            "u.reported_cnt AS reportedCnt, " +
            "u.suspended_until AS suspendedUntil, " +
            "u.suspended_reason AS suspendedReason, " +
            "u.created_date AS createdDate " +
            "FROM tb_user u WHERE u.user_id = :userId", nativeQuery = true)
    AdminUserVO selectAdminUserById(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_user SET " +
            "user_status = :userStatus, " +
            "suspended_until = :suspendedUntil, " +
            "suspended_reason = :suspendedReason, " +
            "updated_id = :adminUserId, " +
            "updated_date = CURRENT_TIMESTAMP " +
            "WHERE user_id = :userId", nativeQuery = true)
    int updateUserStatus(@Param("userId") Long userId,
                         @Param("userStatus") String userStatus,
                         @Param("suspendedUntil") Timestamp suspendedUntil,
                         @Param("suspendedReason") String suspendedReason,
                         @Param("adminUserId") Long adminUserId);
}
