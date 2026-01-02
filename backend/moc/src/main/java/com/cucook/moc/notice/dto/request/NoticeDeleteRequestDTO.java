package com.cucook.moc.notice.dto.request;

import lombok.*;

/**
 * 관리자 공지 삭제(소프트 삭제) 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NoticeDeleteRequestDTO {

    /**
     * 삭제하는 관리자 ID
     */
    private Long adminUserId;
}