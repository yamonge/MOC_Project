package com.cucook.moc.notice.vo;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * tb_notice 테이블과 1:1로 매핑되는 VO
 * - MyBatis resultMap 에서 이 필드를 기준으로 컬럼 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NoticeVO {

    // PK
    private Long noticeId;        // notice_id

    // 공지 기본 정보
    private String title;         // title (공지 제목)
    private String content;       // content (공지 본문, CLOB)
    private String imageUrl;      // image_url (옵션 이미지 URL)

    // 상태 관련
    private Long viewCnt;         // view_cnt (조회수)
    private String isPinned;      // is_pinned (상단 고정 여부 Y/N)
    private String isVisible;     // is_visible (삭제 여부 Y/N -> Y는 삭제, N은 현재 노출되어있는 상태(DEFAULT))

    // 이력 정보
    private Long createdId;       // created_id (작성자: 관리자 user_id)
    private Timestamp createdDate;
    private Long updatedId;       // updated_id (마지막 수정자)
    private Timestamp updatedDate;
}
