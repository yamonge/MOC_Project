package com.cucook.moc.notice.service;

import com.cucook.moc.notice.dto.request.NoticeDeleteRequestDTO;
import com.cucook.moc.notice.dto.request.NoticeSaveRequestDTO;
import com.cucook.moc.notice.dto.request.NoticeSearchRequestDTO;
import com.cucook.moc.notice.dto.response.NoticeDetailResponseDTO;
import com.cucook.moc.notice.dto.response.NoticeListItemResponseDTO;

import java.util.List;

/**
 * 공지사항 비즈니스 인터페이스
 */
public interface NoticeService {
    List<NoticeListItemResponseDTO> getNoticeList(NoticeSearchRequestDTO searchDTO);
    NoticeDetailResponseDTO getNoticeDetail(Long noticeId);

    Long createNotice(NoticeSaveRequestDTO requestDTO);
    void updateNotice(Long noticeId, NoticeSaveRequestDTO requestDTO);

    void togglePin(Long noticeId);

    void deleteNotice(Long noticeId);
}
