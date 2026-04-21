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

        List<NoticeVO> voList = noticeDAO.selectNoticeList(
                searchDTO.getKeyword(),
                searchDTO.getLastNoticeId(),
                searchDTO.getLimit()
        );
        List<NoticeListItemResponseDTO> dtoList = new ArrayList<>();

        for (NoticeVO vo : voList) {
            NoticeListItemResponseDTO dto = new NoticeListItemResponseDTO();
            dto.setNoticeId(vo.getNoticeId());
            dto.setTitle(vo.getTitle());
            dto.setContent(vo.getContent());
            dto.setPinned("Y".equalsIgnoreCase(vo.getIsPinned()));
            dto.setViewCount(vo.getViewCnt() != null ? vo.getViewCnt() : 0L);
            dto.setCreatedDate(vo.getCreatedDate());
            
            String imageUrl = vo.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                    if (!imageUrl.startsWith("/uploads/")) {
                        if (imageUrl.startsWith("notice/")) {
                            imageUrl = "/uploads/" + imageUrl;
                        } else if (imageUrl.startsWith("/notice/")) {
                            imageUrl = "/uploads" + imageUrl;
                        } else {
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

        NoticeVO vo = noticeDAO.findById(noticeId).orElse(null);
        if (vo == null || !"Y".equalsIgnoreCase(vo.getIsVisible())) return null;

        noticeDAO.increaseViewCount(noticeId);

        NoticeDetailResponseDTO dto = new NoticeDetailResponseDTO();
        dto.setNoticeId(vo.getNoticeId());
        dto.setTitle(vo.getTitle());
        dto.setContent(vo.getContent());
        
        String imageUrl = vo.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                if (!imageUrl.startsWith("/uploads/")) {
                    if (imageUrl.startsWith("notice/")) {
                        imageUrl = "/uploads/" + imageUrl;
                    } else if (imageUrl.startsWith("/notice/")) {
                        imageUrl = "/uploads" + imageUrl;
                    } else {
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
    public Long createNotice(NoticeSaveRequestDTO requestDTO, Long adminUserId) {

        Timestamp now = new Timestamp(System.currentTimeMillis());

        NoticeVO vo = new NoticeVO();
        vo.setTitle(requestDTO != null ? requestDTO.getTitle() : null);
        vo.setContent(requestDTO != null ? requestDTO.getContent() : null);
        vo.setImageUrl(requestDTO != null ? requestDTO.getImageUrl() : null);

        vo.setViewCnt(0L);
        vo.setIsPinned(Boolean.TRUE.equals(requestDTO != null ? requestDTO.getPinned() : null) ? "Y" : "N");
        vo.setIsVisible((requestDTO == null || requestDTO.getVisible() == null || requestDTO.getVisible()) ? "Y" : "N");

        vo.setCreatedId(adminUserId);
        vo.setCreatedDate(now);

        NoticeVO saved = noticeDAO.save(vo);
        return saved.getNoticeId();
    }

    @Override
    public void updateNotice(Long noticeId, NoticeSaveRequestDTO requestDTO, Long adminUserId) {

        NoticeVO existing = noticeDAO.findById(noticeId).orElse(null);
        if (existing == null) return;

        Timestamp now = new Timestamp(System.currentTimeMillis());

        if (requestDTO != null && requestDTO.getTitle() != null && !requestDTO.getTitle().isBlank()) {
            existing.setTitle(requestDTO.getTitle());
        }
        if (requestDTO != null && requestDTO.getContent() != null && !requestDTO.getContent().isBlank()) {
            existing.setContent(requestDTO.getContent());
        }

        if (requestDTO != null && requestDTO.getImageUrl() != null) {
            existing.setImageUrl(requestDTO.getImageUrl());
        }

        if (requestDTO != null && requestDTO.getPinned() != null) {
            existing.setIsPinned(Boolean.TRUE.equals(requestDTO.getPinned()) ? "Y" : "N");
        }
        if (requestDTO != null && requestDTO.getVisible() != null) {
            existing.setIsVisible(Boolean.TRUE.equals(requestDTO.getVisible()) ? "Y" : "N");
        }

        existing.setUpdatedId(adminUserId);
        existing.setUpdatedDate(now);

        noticeDAO.save(existing);
    }

    @Override
    public void togglePin(Long noticeId) {
        NoticeVO existing = noticeDAO.findById(noticeId).orElse(null);
        if (existing == null) return;
        String next = "Y".equalsIgnoreCase(existing.getIsPinned()) ? "N" : "Y";
        noticeDAO.updateNoticePin(noticeId, next);
    }

    @Override
    public void deleteNotice(Long noticeId) {
        noticeDAO.softDeleteNotice(noticeId);
    }
}
