package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminStatsDAO;
import com.cucook.moc.admin.dto.response.AdminStatsResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminStatsServiceImpl implements AdminStatsService {

    @Autowired
    private AdminStatsDAO adminStatsDAO;

    @Override
    public AdminStatsResponseDTO getAdminStats(Long adminUserId) {
        if (adminUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 ID가 없습니다.");
        }

        int isAdmin = adminStatsDAO.isAdminUser(adminUserId);
        if (isAdmin <= 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 권한이 없습니다.");
        }

        int totalUsers = adminStatsDAO.countNonWithdrawUsers();
        int userReports = adminStatsDAO.countPendingUserReports();
        int recipeReports = adminStatsDAO.countPendingRecipeReports();
        int pendingReports = userReports + recipeReports;

        AdminStatsResponseDTO dto = new AdminStatsResponseDTO();
        dto.setTotalUsers(totalUsers);
        dto.setPendingReports(pendingReports);
        return dto;
    }
}
