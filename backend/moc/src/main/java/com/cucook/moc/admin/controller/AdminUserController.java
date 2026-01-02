package com.cucook.moc.admin.controller;

import com.cucook.moc.admin.dto.request.*;
import com.cucook.moc.admin.dto.response.AdminUserListItemResponseDTO;
import com.cucook.moc.admin.dto.response.AdminUserListResponseDTO;
import com.cucook.moc.admin.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 회원 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * 회원 목록 조회
     * GET /api/admin/users?userId=관리자ID&status=ALL|ACTIVE|SUSPENDED&keyword=&lastUserId=&limit=
     */
    @GetMapping
    public AdminUserListResponseDTO getUserList(
            @RequestParam("userId") Long adminUserId,
            @ModelAttribute AdminUserSearchRequestDTO request
    ) {
        return adminUserService.getUserList(adminUserId, request);
    }

    /**
     * 회원 정지
     * POST /api/admin/users/{targetUserId}/suspend?userId=관리자ID
     */
    @PostMapping("/{targetUserId}/suspend")
    public void suspendUser(
            @RequestParam("userId") Long adminUserId,
            @PathVariable("targetUserId") Long targetUserId,
            @RequestBody AdminUserSuspendRequestDTO request
    ) {
        adminUserService.suspendUser(adminUserId, targetUserId, request);
    }

    /**
     * 회원 활성화(정지 해제)
     * POST /api/admin/users/{targetUserId}/activate?userId=관리자ID
     */
    @PostMapping("/{targetUserId}/activate")
    public void activateUser(
            @RequestParam("userId") Long adminUserId,
            @PathVariable("targetUserId") Long targetUserId,
            @RequestBody AdminUserActivateRequestDTO request
    ) {
        adminUserService.activateUser(adminUserId, targetUserId, request);
    }


    /**
     * 회원 탈퇴(소프트 삭제)
     * POST /api/admin/users/{targetUserId}/withdraw?userId=관리자ID
     */
    @PostMapping("/{targetUserId}/withdraw")
    public void withdrawUser(
            @RequestParam("userId") Long adminUserId,
            @PathVariable("targetUserId") Long targetUserId,
            @RequestBody AdminUserWithdrawRequestDTO request
    ) {
        adminUserService.withdrawUser(adminUserId, targetUserId, request);
    }
}
