package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dto.request.AdminUserReportProcessRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminUserReportListItemResponseDTO;

import java.util.List;

public interface AdminUserReportService {

    List<AdminUserReportListItemResponseDTO> getUserReportList(AdminUserReportSearchRequestDTO searchDTO);

    void processUserReport(AdminUserReportProcessRequestDTO requestDTO);
}
