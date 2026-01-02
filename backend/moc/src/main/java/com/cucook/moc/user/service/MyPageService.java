package com.cucook.moc.user.service;

import com.cucook.moc.user.dto.response.MyPageCountResponseDTO;
import com.cucook.moc.user.dto.response.MyPageReportItemDTO;

import java.util.List;

public interface MyPageService {

    MyPageCountResponseDTO getMyPageCounts(Long userId);

    /**
     * 마이페이지 - 내가 한 신고 내역 조회
     * (레시피 신고 + 사용자 신고 통합)
     */
    List<MyPageReportItemDTO> getMyReportHistory(Long userId);

}
