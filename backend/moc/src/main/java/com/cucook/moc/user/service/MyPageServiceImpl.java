package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.MyPageRepository;
import com.cucook.moc.user.dto.response.MyPageCountResponseDTO;
import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageRepository myPageRepository;

    @Override
    public MyPageCountResponseDTO getMyPageCounts(Long userId) {
        int completedCount = myPageRepository.countCompletedMeetings(userId);
        
        int totalMeetings = myPageRepository.countTotalMeetings(userId);
        
        double attendanceRate = 0.0;
        if (totalMeetings > 0) {
            attendanceRate = Math.round((double) completedCount / totalMeetings * 100.0 * 10.0) / 10.0;
        }

        return new MyPageCountResponseDTO(
                myPageRepository.countUserIngredients(userId),
                myPageRepository.countSavedRecipes(userId),
                myPageRepository.countSharedRecipes(userId),
                myPageRepository.countReceivedReviews(userId),
                myPageRepository.countMyReports(userId),
                completedCount,
                attendanceRate
        );
    }

    @Override
    public List<MyPageReportItemDTO> getMyReportHistory(Long userId) {
        return myPageRepository.selectMyReportHistory(userId);
    }
}
