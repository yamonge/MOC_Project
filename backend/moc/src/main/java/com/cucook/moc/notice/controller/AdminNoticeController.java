package com.cucook.moc.notice.controller;

import com.cucook.moc.common.FileUploadUtil;
import com.cucook.moc.notice.dto.request.NoticeSaveRequestDTO;
import com.cucook.moc.notice.dto.request.NoticeSearchRequestDTO;
import com.cucook.moc.notice.dto.response.NoticeDetailResponseDTO;
import com.cucook.moc.notice.dto.response.NoticeListItemResponseDTO;
import com.cucook.moc.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/notices")
@RequiredArgsConstructor
public class AdminNoticeController {

    private final NoticeService noticeService;
    private final FileUploadUtil fileUploadUtil;

    @GetMapping
    public ResponseEntity<List<NoticeListItemResponseDTO>> getNoticeList(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "lastNoticeId", required = false) Long lastNoticeId,
            @RequestParam(value = "limit", required = false) Integer limit) {

        NoticeSearchRequestDTO dto = new NoticeSearchRequestDTO();
        dto.setKeyword(keyword);
        dto.setLastNoticeId(lastNoticeId);
        dto.setLimit(limit);

        return ResponseEntity.ok(noticeService.getNoticeList(dto));
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeDetailResponseDTO> getNoticeDetail(@PathVariable Long noticeId) {
        NoticeDetailResponseDTO detail = noticeService.getNoticeDetail(noticeId);
        if (detail == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(detail);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createNotice(
            @RequestPart(value = "title") String title,
            @RequestPart(value = "content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // 이미지 파일 처리
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            // 파일 유효성 검증
            if (!FileUploadUtil.isValidImageFile(image)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 이미지 파일 형식입니다.");
            }
            if (!FileUploadUtil.isValidFileSize(image)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 크기는 10MB를 초과할 수 없습니다.");
            }

            try {
                // 파일 저장 후 절대 URL 획득
                imageUrl = fileUploadUtil.saveNoticeImage(image);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 저장 실패: " + e.getMessage());
            }
        }

        // DTO 생성 및 저장
        NoticeSaveRequestDTO requestDTO = new NoticeSaveRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setImageUrl(imageUrl);

        return ResponseEntity.ok(noticeService.createNotice(requestDTO));
    }

    @PutMapping(value = "/{noticeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateNotice(
            @PathVariable Long noticeId,
            @RequestPart(value = "title", required = false) String title,
            @RequestPart(value = "content", required = false) String content,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // 이미지 파일 처리
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            // 파일 유효성 검증
            if (!FileUploadUtil.isValidImageFile(image)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 이미지 파일 형식입니다.");
            }
            if (!FileUploadUtil.isValidFileSize(image)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 크기는 10MB를 초과할 수 없습니다.");
            }

            try {
                // 파일 저장 후 절대 URL 획득
                imageUrl = fileUploadUtil.saveNoticeImage(image);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 저장 실패: " + e.getMessage());
            }
        }

        // DTO 생성 및 업데이트
        NoticeSaveRequestDTO requestDTO = new NoticeSaveRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setImageUrl(imageUrl);

        noticeService.updateNotice(noticeId, requestDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{noticeId}/pin")
    public ResponseEntity<Void> togglePin(@PathVariable Long noticeId) {
        noticeService.togglePin(noticeId); // pinned 상태 토글
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Void> delete(@PathVariable Long noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }
}
