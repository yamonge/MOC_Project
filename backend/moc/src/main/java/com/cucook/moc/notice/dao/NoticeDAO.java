package com.cucook.moc.notice.dao;

import com.cucook.moc.notice.dto.request.NoticeSearchRequestDTO;
import com.cucook.moc.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 공지사항 MyBatis DAO
 */
@Mapper
public interface NoticeDAO {

    // 공지 목록 (cursor 기반)
    List<NoticeVO> selectNoticeList(NoticeSearchRequestDTO searchDTO);

    // 공지 단건 조회
    NoticeVO selectNoticeById(@Param("noticeId") Long noticeId);

    // 공지 등록
    void insertNotice(NoticeVO notice);

    // 공지 수정
    void updateNotice(NoticeVO notice);

    // 상단 고정 / 해제
    void updateNoticePin(@Param("noticeId") Long noticeId,
                         @Param("isPinned") String isPinned);

    // 소프트 삭제 (is_visible = 'N')
    void softDeleteNotice(@Param("noticeId") Long noticeId);

    // 조회수 증가
    void increaseViewCount(@Param("noticeId") Long noticeId);
}
