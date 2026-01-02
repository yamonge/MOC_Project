package com.cucook.moc.notice.service;

import com.cucook.moc.notice.dao.NoticeDAO;
import com.cucook.moc.notice.dto.request.NoticeSaveRequestDTO;
import com.cucook.moc.notice.dto.request.NoticeSearchRequestDTO;
import com.cucook.moc.notice.dto.response.NoticeDetailResponseDTO;
import com.cucook.moc.notice.dto.response.NoticeListItemResponseDTO;
import com.cucook.moc.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeDAO noticeDAO;
    
    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;

    @Override
    @Transactional(readOnly = true)
    public List<NoticeListItemResponseDTO> getNoticeList(NoticeSearchRequestDTO searchDTO) {

        if (searchDTO.getLimit() == null || searchDTO.getLimit() <= 0) {
            searchDTO.setLimit(20);
        }

        List<NoticeVO> voList = noticeDAO.selectNoticeList(searchDTO);
        List<NoticeListItemResponseDTO> dtoList = new ArrayList<>();

        for (NoticeVO vo : voList) {
            NoticeListItemResponseDTO dto = new NoticeListItemResponseDTO();
            dto.setNoticeId(vo.getNoticeId());
            dto.setTitle(vo.getTitle());
            dto.setContent(vo.getContent()); // 200자 프리뷰
            dto.setPinned("Y".equalsIgnoreCase(vo.getIsPinned()));
            dto.setViewCount(vo.getViewCnt() != null ? vo.getViewCnt() : 0L);
            dto.setCreatedDate(vo.getCreatedDate());
            
            // 이미지 URL 변환 (상대 경로 → 절대 URL)
            String imageUrl = vo.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                // 이미 절대 URL이면 그대로, 상대 경로면 절대 URL로 변환
                if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                    // /uploads/로 시작하지 않으면 추가
                    if (!imageUrl.startsWith("/uploads/")) {
                        // notice/로 시작하는 경우 /uploads/ 추가
                        if (imageUrl.startsWith("notice/")) {
                            imageUrl = "/uploads/" + imageUrl;
                        } else if (imageUrl.startsWith("/notice/")) {
                            imageUrl = "/uploads" + imageUrl;
                        } else {
                            // 기타 경우 /uploads/ 추가
                            imageUrl = "/uploads/" + imageUrl;
                        }
                    }
                    imageUrl = serverBaseUrl + imageUrl;
                }
            }
            dto.setImageUrl(imageUrl);
            
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    public NoticeDetailResponseDTO getNoticeDetail(Long noticeId) {

        NoticeVO vo = noticeDAO.selectNoticeById(noticeId);
        if (vo == null || !"Y".equalsIgnoreCase(vo.getIsVisible())) return null;

        noticeDAO.increaseViewCount(noticeId);

        NoticeDetailResponseDTO dto = new NoticeDetailResponseDTO();
        dto.setNoticeId(vo.getNoticeId());
        dto.setTitle(vo.getTitle());
        dto.setContent(vo.getContent());
        
        // 이미지 URL 변환 (상대 경로 → 절대 URL)
        String imageUrl = vo.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            // 이미 절대 URL이면 그대로, 상대 경로면 절대 URL로 변환
            if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                // /uploads/로 시작하지 않으면 추가
                if (!imageUrl.startsWith("/uploads/")) {
                    // notice/로 시작하는 경우 /uploads/ 추가
                    if (imageUrl.startsWith("notice/")) {
                        imageUrl = "/uploads/" + imageUrl;
                    } else if (imageUrl.startsWith("/notice/")) {
                        imageUrl = "/uploads" + imageUrl;
                    } else {
                        // 기타 경우 /uploads/ 추가
                        imageUrl = "/uploads/" + imageUrl;
                    }
                }
                imageUrl = serverBaseUrl + imageUrl;
            }
        }
        dto.setImageUrl(imageUrl);
        
        dto.setPinned("Y".equalsIgnoreCase(vo.getIsPinned()));
        dto.setVisible("Y".equalsIgnoreCase(vo.getIsVisible()));
        dto.setViewCount((vo.getViewCnt() != null ? vo.getViewCnt() : 0L) + 1L);
        dto.setCreatedDate(vo.getCreatedDate());
        dto.setUpdatedDate(vo.getUpdatedDate());
        return dto;
    }

    @Override
    public Long createNotice(NoticeSaveRequestDTO requestDTO) {

        Timestamp now = new Timestamp(System.currentTimeMillis());

        NoticeVO vo = new NoticeVO();
        vo.setTitle(requestDTO != null ? requestDTO.getTitle() : null);
        vo.setContent(requestDTO != null ? requestDTO.getContent() : null);
        vo.setImageUrl(requestDTO != null ? requestDTO.getImageUrl() : null);

        vo.setViewCnt(0L);
        vo.setIsPinned(Boolean.TRUE.equals(requestDTO != null ? requestDTO.getPinned() : null) ? "Y" : "N");
        vo.setIsVisible((requestDTO == null || requestDTO.getVisible() == null || requestDTO.getVisible()) ? "Y" : "N");

        vo.setCreatedId(null);
        vo.setCreatedDate(now);

        noticeDAO.insertNotice(vo);
        return vo.getNoticeId();
    }

    @Override
    public void updateNotice(Long noticeId, NoticeSaveRequestDTO requestDTO) {

        NoticeVO existing = noticeDAO.selectNoticeById(noticeId);
        if (existing == null) return; // 존재 없으면 조용히 종료(원하면 예외로 변경 가능)

        Timestamp now = new Timestamp(System.currentTimeMillis());

        NoticeVO vo = new NoticeVO();
        vo.setNoticeId(noticeId);

        // ✅ title/content는 null/blank면 기존 유지 (검증이 아니라 기능 안정화)
        if (requestDTO != null && requestDTO.getTitle() != null && !requestDTO.getTitle().isBlank()) {
            vo.setTitle(requestDTO.getTitle());
        }
        if (requestDTO != null && requestDTO.getContent() != null && !requestDTO.getContent().isBlank()) {
            vo.setContent(requestDTO.getContent());
        }

        // imageUrl: null이면 유지, ""면 제거(Oracle에서는 '' -> NULL)
        if (requestDTO != null && requestDTO.getImageUrl() != null) {
            vo.setImageUrl(requestDTO.getImageUrl());
        }

        // pinned/visible: null이면 유지
        if (requestDTO != null && requestDTO.getPinned() != null) {
            vo.setIsPinned(Boolean.TRUE.equals(requestDTO.getPinned()) ? "Y" : "N");
        }
        if (requestDTO != null && requestDTO.getVisible() != null) {
            vo.setIsVisible(Boolean.TRUE.equals(requestDTO.getVisible()) ? "Y" : "N");
        }

        vo.setUpdatedId(null); // ✅ adminUserId 안 씀
        vo.setUpdatedDate(now);

        noticeDAO.updateNotice(vo);
    }
    @Override
    public void togglePin(Long noticeId) {
        NoticeVO existing = noticeDAO.selectNoticeById(noticeId);
        String next = "Y".equalsIgnoreCase(existing.getIsPinned()) ? "N" : "Y";
        noticeDAO.updateNoticePin(noticeId, next);
    }

    @Override
    public void deleteNotice(Long noticeId) {
        noticeDAO.softDeleteNotice(noticeId);
    }
}
