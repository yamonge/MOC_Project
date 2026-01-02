package com.cucook.moc.admin.dto.response;

public class AdminStatsResponseDTO {
    private int totalUsers;
    private int pendingReports;

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(int pendingReports) {
        this.pendingReports = pendingReports;
    }
}
