package com.cucook.moc.admin.dto.request;

import lombok.*;

/*
 * 관리자 회원 목록 검색 조건 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserSearchRequestDTO {

    /* 이메일 또는 닉네임 검색 키워드 */
    private String keyword;

    /* ACTIVE / SUSPENDED / WITHDRAW */
    private String status;

    // 마지막으로 받은 user_id (처음 요청 시 null)
    private Long lastUserId;

    // 한 번에 몇 개 가져올지 (limit)
    private Integer limit;
}