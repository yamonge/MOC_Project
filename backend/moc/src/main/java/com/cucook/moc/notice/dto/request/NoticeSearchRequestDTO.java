package com.cucook.moc.notice.dto.request;

import lombok.*;

/**
 * 공지 목록 검색 조건 (cursor 기반)
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class NoticeSearchRequestDTO {

    /** 제목 검색 키워드 */
    private String keyword;

    /** 마지막으로 조회한 notice_id (첫 요청 시 null) */
    private Long lastNoticeId;

    /** 한 번에 조회할 데이터 수 */
    private Integer limit;
}
