package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dto.request.*;
import com.cucook.moc.admin.dto.response.AdminUserListItemResponseDTO;
import com.cucook.moc.admin.dto.response.AdminUserListResponseDTO;

import java.util.List;

/**
 * 관리자 회원 관리 비즈니스 로직 인터페이스
 */
public interface AdminUserService {

    AdminUserListResponseDTO getUserList(Long adminUserId, AdminUserSearchRequestDTO request);

    void suspendUser(Long adminUserId, Long targetUserId, AdminUserSuspendRequestDTO request);

    void activateUser(Long adminUserId, Long targetUserId, AdminUserActivateRequestDTO request);

    void withdrawUser(Long adminUserId, Long targetUserId, AdminUserWithdrawRequestDTO request);
}
