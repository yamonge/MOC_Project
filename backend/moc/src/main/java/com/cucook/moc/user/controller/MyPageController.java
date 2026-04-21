package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.response.MyPageCountResponseDTO;
import com.cucook.moc.user.dto.response.MyPageReportItemDTO;
import com.cucook.moc.user.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/{userId}/mypage/counts")
    public MyPageCountResponseDTO getMyPageCounts(
            @PathVariable Long userId,
            Authentication authentication) {
        Long authUserId = Long.parseLong(authentication.getName());
        return myPageService.getMyPageCounts(authUserId);
    }

    @GetMapping("/{userId}/my-page/reports")
    public List<MyPageReportItemDTO> getMyReportHistory(
            @PathVariable Long userId,
            Authentication authentication) {
        Long authUserId = Long.parseLong(authentication.getName());
        return myPageService.getMyReportHistory(authUserId);
    }
}