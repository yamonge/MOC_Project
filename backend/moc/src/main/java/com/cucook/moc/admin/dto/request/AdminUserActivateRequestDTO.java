package com.cucook.moc.admin.dto.request;

import lombok.*;

/**
 * 관리자 - 계정 정지 해제(활성화) 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserActivateRequestDTO {

    private Long adminUserId;
}

