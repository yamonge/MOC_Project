package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dto.response.AdminStatsResponseDTO;

public interface AdminStatsService {
    AdminStatsResponseDTO getAdminStats(Long adminUserId);
}
