package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.dto.request.AdminUserSearchRequestDTO;
import com.cucook.moc.admin.vo.AdminUserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.sql.Timestamp;
import java.util.List;

/**
 * 관리자 회원 관리 DAO (tb_user)
 */
@Mapper
public interface AdminUserDAO {
    // 회원 목록 (WITHDRAW 제외)
    List<AdminUserVO> selectAdminUserList(AdminUserSearchRequestDTO request);

    // 관리자 본인 조회 (권한 검증용)
    AdminUserVO selectAdminUserById(@Param("userId") Long userId);

    // 상태 업데이트(정지/해제/탈퇴 공통)
    int updateUserStatus(
            @Param("userId") Long userId,
            @Param("userStatus") String userStatus,
            @Param("suspendedUntil") Timestamp suspendedUntil,
            @Param("suspendedReason") String suspendedReason,
            @Param("adminUserId") Long adminUserId
    );
}
