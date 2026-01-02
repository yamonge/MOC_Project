package com.cucook.moc.admin.controller;

import com.cucook.moc.admin.dto.request.AdminRecipeReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeReportListItemResponseDTO;
import com.cucook.moc.admin.service.AdminRecipeReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/reports/recipes")
public class AdminRecipeReportController {

    private final AdminRecipeReportService adminRecipeReportService;

    /**
     * 레시피 신고 목록 조회
     * GET /api/admin/reports/recipes
     * - cursor 기반(lastRecipeReportId + limit)
     */
    @GetMapping
    public List<AdminRecipeReportListItemResponseDTO> getRecipeReportList(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "reasonCd", required = false) String reasonCd,
            @RequestParam(value = "statusCd", required = false) String statusCd, // PENDING/APPROVED/REJECTED/ALL
            @RequestParam(value = "lastRecipeReportId", required = false) Long lastRecipeReportId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "userId", required = false) Long adminUserId
    ) {
        AdminRecipeReportSearchRequestDTO searchDTO = new AdminRecipeReportSearchRequestDTO();
        searchDTO.setKeyword(keyword);
        searchDTO.setReasonCd(reasonCd);
        searchDTO.setStatusCd(statusCd);
        searchDTO.setLastRecipeReportId(lastRecipeReportId);
        searchDTO.setLimit(limit);

        return adminRecipeReportService.getRecipeReportList(searchDTO);
    }

    /**
     * 레시피 신고 처리완료 마킹
     * POST /api/admin/reports/recipes/{recipeReportId}/process
     */
    @PostMapping("/{recipeReportId}/process")
    public void processRecipeReport(
            @PathVariable Long recipeReportId,
            @RequestParam(value = "userId", required = false) Long adminUserId
    ) {
        adminRecipeReportService.processRecipeReport(recipeReportId, adminUserId);
    }
}
