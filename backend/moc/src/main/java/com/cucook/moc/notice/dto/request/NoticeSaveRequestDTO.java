package com.cucook.moc.notice.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 공지 작성/수정 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class NoticeSaveRequestDTO {

    /** 제목 */
    private String title;

    /** 내용 */
    private String content;

    /** 이미지 URL (선택) */
    private String imageUrl;

    /** 상단 고정 여부 */
    private Boolean pinned;   // null이면 create 기본 N, update는 기존 유지
    /** 소프트 삭제 **/
    private Boolean visible;  // null이면 create 기본 Y, update는 기존 유지

}
