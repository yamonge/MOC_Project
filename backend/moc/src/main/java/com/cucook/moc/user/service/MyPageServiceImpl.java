package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.MyPageDAO;
import com.cucook.moc.user.dto.response.MyPageCountResponseDTO;
import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import com.cucook.moc.user.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageDAO myPageDAO;

    @Override
    public MyPageCountResponseDTO getMyPageCounts(Long userId) {
        // 완료된 모임 수 (status_cd = 'DONE'인 참여 게시물)
        int completedCount = myPageDAO.countCompletedMeetings(userId);
        
        // 전체 참여한 모임 수
        int totalMeetings = myPageDAO.countTotalMeetings(userId);
        
        // 참석률 계산 (완료된 모임 / 전체 모임 * 100)
        double attendanceRate = 0.0;
        if (totalMeetings > 0) {
            attendanceRate = Math.round((double) completedCount / totalMeetings * 100.0 * 10.0) / 10.0;
        }

        return new MyPageCountResponseDTO(
                myPageDAO.countUserIngredients(userId),
                myPageDAO.countSavedRecipes(userId),
                myPageDAO.countSharedRecipes(userId),
                myPageDAO.countReceivedReviews(userId),
                myPageDAO.countMyReports(userId),
                completedCount,
                attendanceRate
        );
    }
    @Override
    public List<MyPageReportItemDTO> getMyReportHistory(Long userId) {
        return myPageDAO.selectMyReportHistory(userId);
    }
}
