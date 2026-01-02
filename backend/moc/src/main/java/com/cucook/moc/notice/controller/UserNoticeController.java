package com.cucook.moc.notice.controller;

import com.cucook.moc.notice.dto.request.NoticeSearchRequestDTO;
import com.cucook.moc.notice.dto.response.NoticeDetailResponseDTO;
import com.cucook.moc.notice.dto.response.NoticeListItemResponseDTO;
import com.cucook.moc.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 일반 사용자 공지사항 컨트롤러
 * - URL: /api/notifications
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class UserNoticeController {

    private final NoticeService noticeService;

    /**
     * 공지 목록 조회 (cursor 기반)
     * GET /api/notifications?keyword=&lastNoticeId=&limit=
     */
    @GetMapping
    public ResponseEntity<List<NoticeListItemResponseDTO>> getNoticeList(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "lastNoticeId", required = false) Long lastNoticeId,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        NoticeSearchRequestDTO searchDTO = new NoticeSearchRequestDTO();
        searchDTO.setKeyword(keyword);
        searchDTO.setLastNoticeId(lastNoticeId);
        searchDTO.setLimit(limit);

        return ResponseEntity.ok(noticeService.getNoticeList(searchDTO));
    }

    /**
     * 공지 상세 조회 (+조회수 증가)
     * GET /api/notifications/{noticeId}
     */
    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeDetailResponseDTO> getNoticeDetail(@PathVariable Long noticeId) {
        NoticeDetailResponseDTO detail = noticeService.getNoticeDetail(noticeId);
        if (detail == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(detail);
    }
}
