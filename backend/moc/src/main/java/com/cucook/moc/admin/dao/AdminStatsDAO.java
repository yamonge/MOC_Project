package com.cucook.moc.admin.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminStatsDAO {

    int countNonWithdrawUsers();

    int countPendingUserReports();

    int countPendingRecipeReports();

    int isAdminUser(@Param("adminUserId") Long adminUserId);
}
