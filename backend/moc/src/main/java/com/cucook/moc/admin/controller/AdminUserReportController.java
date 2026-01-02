package com.cucook.moc.admin.controller;

import com.cucook.moc.admin.dto.request.AdminUserReportProcessRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminUserReportListItemResponseDTO;
import com.cucook.moc.admin.service.AdminUserReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports/users")
@RequiredArgsConstructor
public class AdminUserReportController {

    private final AdminUserReportService adminUserReportService;

    /**
     * 유저 신고 목록 조회
     * - cursor 기반(lastUserReportId + limit)
     */
    @GetMapping
    public List<AdminUserReportListItemResponseDTO> getUserReportList(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "reasonCd", required = false) String reasonCd,
            @RequestParam(value = "statusCd", required = false) String statusCd, // PENDING/PROCESSED/ALL
            @RequestParam(value = "lastUserReportId", required = false) Long lastUserReportId,
            @RequestParam(value = "limit", required = false) Integer limit,
            // axios meta.requiresUserId=true로 자동으로 params.userId 붙는 구조를 활용
            @RequestParam(value = "userId", required = false) Long adminUserId
    ) {
        AdminUserReportSearchRequestDTO searchDTO = new AdminUserReportSearchRequestDTO();
        searchDTO.setKeyword(keyword);
        searchDTO.setReasonCd(reasonCd);
        searchDTO.setStatusCd(statusCd);
        searchDTO.setLastUserReportId(lastUserReportId);
        searchDTO.setLimit(limit);

        return adminUserReportService.getUserReportList(searchDTO);
    }

    /**
     * 신고 처리완료 마킹
     * - WARNING/SUSPEND/REJECT 등 actionType은 기록용으로 받고,
     * - 처리상태(processing_status_cd)는 PROCESSED로 통일(필터도 PROCESSED 기반)
     */
    @PostMapping("/{userReportId}/process")
    public void processUserReport(
            @PathVariable Long userReportId,
            @RequestParam(value = "userId", required = false) Long adminUserId,
            @RequestBody AdminUserReportProcessRequestDTO requestDTO
    ) {
        requestDTO.setUserReportId(userReportId);

        // ✅ body에 adminUserId 없어도 동작하도록 보정
        if (requestDTO.getAdminUserId() == null) {
            requestDTO.setAdminUserId(adminUserId);
        }

        if (requestDTO.getAdminUserId() == null) {
            throw new IllegalArgumentException("adminUserId가 없습니다. (query param userId 또는 body.adminUserId 필요)");
        }

        adminUserReportService.processUserReport(requestDTO);
    }
}
