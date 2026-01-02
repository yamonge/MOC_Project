package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.dto.request.AdminUserReportSearchRequestDTO;
import com.cucook.moc.admin.vo.AdminUserReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.util.List;

/**
 * 관리자 유저 신고 관리 DAO (tb_user_report)
 */
@Mapper
public interface AdminUserReportDAO {

    List<AdminUserReportVO> selectUserReportList(AdminUserReportSearchRequestDTO searchDTO);

    /**
     * 신고 ID로 신고 정보 조회 (알림 전송용)
     */
    AdminUserReportVO selectUserReportById(@Param("userReportId") Long userReportId);

    int updateUserReportStatus(
            @Param("userReportId") Long userReportId,
            @Param("statusCd") String statusCd,
            @Param("processorId") Long processorId,
            @Param("processedDate") Timestamp processedDate
    );
}