package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dto.request.AdminRecipeReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeReportListItemResponseDTO;

import java.util.List;

public interface AdminRecipeReportService {
    void processRecipeReport(Long recipeReportId, Long adminUserId);
    
    List<AdminRecipeReportListItemResponseDTO> getRecipeReportList(AdminRecipeReportSearchRequestDTO searchDTO);
}
