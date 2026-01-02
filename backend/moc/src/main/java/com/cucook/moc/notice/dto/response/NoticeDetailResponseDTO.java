package com.cucook.moc.notice.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

/**
 * 공지 상세 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class NoticeDetailResponseDTO {

    private Long noticeId;
    private String title;
    private String content;
    private String imageUrl;
    private boolean pinned;
    private boolean visible;
    private long viewCount;
    private Timestamp createdDate;
    private Timestamp updatedDate;
}
