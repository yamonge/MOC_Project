package com.cucook.moc.notice.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

/**
 * 공지 목록 라인 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class NoticeListItemResponseDTO {

    private Long noticeId;
    private String title;

    // (선택) 목록에서 200자 프리뷰 내려줌
    private String content;

    private String imageUrl; // 이미지 URL 추가

    private boolean pinned;
    private long viewCount;
    private Timestamp createdDate;
}
