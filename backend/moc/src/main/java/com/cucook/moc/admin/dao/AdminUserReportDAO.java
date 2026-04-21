package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.vo.AdminUserReportVO;
import com.cucook.moc.user.vo.UserReportVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

public interface AdminUserReportDAO extends JpaRepository<UserReportVO, Long> {

    @Query(value = "SELECT " +
            "r.user_report_id AS userReportId, " +
            "r.report_reason_cd AS reportReasonCd, " +
            "r.processing_status_cd AS processingStatusCd, " +
            "r.created_date AS createdDate, " +
            "r.reporter_user_id AS reporterUserId, " +
            "u1.user_nickname AS reporterNickname, " +
            "r.reported_user_id AS reportedUserId, " +
            "u2.user_nickname AS reportedNickname, " +
            "r.report_comment AS reportComment " +
            "FROM tb_user_report r " +
            "JOIN tb_user u1 ON u1.user_id = r.reporter_user_id " +
            "JOIN tb_user u2 ON u2.user_id = r.reported_user_id " +
            "WHERE r.processing_status_cd = 'PENDING' " +
            "AND (:reasonCd IS NULL OR :reasonCd = '' OR r.report_reason_cd = :reasonCd) " +
            "AND (:statusCd IS NULL OR :statusCd = '' OR :statusCd = 'ALL' " +
            "  OR r.processing_status_cd = :statusCd) " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "  OR u1.user_nickname LIKE CONCAT('%', :keyword, '%') " +
            "  OR u2.user_nickname LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:lastUserReportId IS NULL OR r.user_report_id < :lastUserReportId) " +
            "ORDER BY r.user_report_id DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<AdminUserReportVO> selectUserReportList(@Param("reasonCd") String reasonCd,
                                                  @Param("statusCd") String statusCd,
                                                  @Param("keyword") String keyword,
                                                  @Param("lastUserReportId") Long lastUserReportId,
                                                  @Param("limit") Integer limit);

    @Query(value = "SELECT " +
            "r.user_report_id AS userReportId, " +
            "r.report_reason_cd AS reportReasonCd, " +
            "r.processing_status_cd AS processingStatusCd, " +
            "r.reporter_user_id AS reporterUserId, " +
            "r.reported_user_id AS reportedUserId, " +
            "r.report_comment AS reportComment, " +
            "r.created_date AS createdDate " +
            "FROM tb_user_report r WHERE r.user_report_id = :userReportId", nativeQuery = true)
    AdminUserReportVO selectUserReportById(@Param("userReportId") Long userReportId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_user_report SET " +
            "processing_status_cd = :statusCd, " +
            "processor_id = :processorId, " +
            "processed_date = :processedDate " +
            "WHERE user_report_id = :userReportId", nativeQuery = true)
    int updateUserReportStatus(@Param("userReportId") Long userReportId,
                               @Param("statusCd") String statusCd,
                               @Param("processorId") Long processorId,
                               @Param("processedDate") Timestamp processedDate);
}
