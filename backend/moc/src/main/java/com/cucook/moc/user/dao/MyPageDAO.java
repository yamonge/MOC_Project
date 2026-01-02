package com.cucook.moc.user.dao;

import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPageDAO {

    int countUserIngredients(@Param("userId") Long userId);

    int countSavedRecipes(@Param("userId") Long userId);

    int countSharedRecipes(@Param("userId") Long userId);

    int countReceivedReviews(@Param("userId") Long userId);

    int countMyReports(@Param("userId") Long userId);

    /**
     * 완료된 모임 수 (status_cd = 'DONE')
     */
    int countCompletedMeetings(@Param("userId") Long userId);

    /**
     * 전체 참여한 모임 수 (나간 방 제외)
     */
    int countTotalMeetings(@Param("userId") Long userId);

    List<MyPageReportItemDTO> selectMyReportHistory(Long userId);
}
