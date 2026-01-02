package com.cucook.moc.admin.controller;

import com.cucook.moc.admin.dto.response.AdminStatsResponseDTO;
import com.cucook.moc.admin.service.AdminStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminStatsController {

    @Autowired
    private AdminStatsService adminStatsService;

    /**
     * 관리자 통계
     * GET /api/admin/stats?userId=관리자ID
     */
    @GetMapping("/stats")
    public AdminStatsResponseDTO getAdminStats(@RequestParam(value = "userId", required = false) Long adminUserId) {
        return adminStatsService.getAdminStats(adminUserId);
    }
}
