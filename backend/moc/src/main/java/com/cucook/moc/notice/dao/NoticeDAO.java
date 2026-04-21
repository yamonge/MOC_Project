package com.cucook.moc.notice.dao;

import com.cucook.moc.notice.vo.NoticeVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NoticeDAO extends JpaRepository<NoticeVO, Long> {

    @Query(value = "SELECT * FROM ( " +
            "SELECT n.* FROM tb_notice n " +
            "WHERE n.is_visible = 'Y' " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "  OR LOWER(n.title) LIKE CONCAT('%', LOWER(:keyword), '%') " +
            "  OR LOWER(n.content) LIKE CONCAT('%', LOWER(:keyword), '%')) " +
            "AND (:lastNoticeId IS NULL OR n.notice_id < :lastNoticeId) " +
            "ORDER BY CASE WHEN n.is_pinned = 'Y' THEN 0 ELSE 1 END, n.notice_id DESC " +
            ") sub LIMIT :limit", nativeQuery = true)
    List<NoticeVO> selectNoticeList(@Param("keyword") String keyword,
                                    @Param("lastNoticeId") Long lastNoticeId,
                                    @Param("limit") int limit);

    @Modifying
    @Transactional
    @Query("UPDATE NoticeVO n SET n.isPinned = :isPinned, n.updatedDate = CURRENT_TIMESTAMP " +
            "WHERE n.noticeId = :noticeId")
    void updateNoticePin(@Param("noticeId") Long noticeId, @Param("isPinned") String isPinned);

    @Modifying
    @Transactional
    @Query("UPDATE NoticeVO n SET n.isVisible = 'N', n.updatedDate = CURRENT_TIMESTAMP " +
            "WHERE n.noticeId = :noticeId")
    void softDeleteNotice(@Param("noticeId") Long noticeId);

    @Modifying
    @Transactional
    @Query("UPDATE NoticeVO n SET n.viewCnt = COALESCE(n.viewCnt, 0) + 1 " +
            "WHERE n.noticeId = :noticeId")
    void increaseViewCount(@Param("noticeId") Long noticeId);
}
