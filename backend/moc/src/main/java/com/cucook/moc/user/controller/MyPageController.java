package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.response.MyPageCountResponseDTO;
import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import com.cucook.moc.user.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/{userId}/mypage/counts")
    public MyPageCountResponseDTO getMyPageCounts(@PathVariable Long userId) {
        return myPageService.getMyPageCounts(userId);
    }
    @GetMapping("/{userId}/my-page/reports")
    public List<MyPageReportItemDTO> getMyReportHistory(
            @PathVariable Long userId
    ) {
        return myPageService.getMyReportHistory(userId);
    }
}