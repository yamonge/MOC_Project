package com.cucook.moc.admin.dto.response;

import lombok.*;
import java.sql.Timestamp;

/**
 * 관리자 회원 목록 한 행에 대한 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserListItemResponseDTO {

    // 프론트 필드명 유지: id, name, nickname, email, joinDate, reportCount, status
    private Long id;
    private String email;
    private String name;
    private String nickname;

    // ACTIVE / SUSPENDED (프론트에서 normalizeStatus로 처리)
    private String status;

    private Integer reportCount;

    // "yyyy.MM.dd"
    private String joinDate;

    // 선택값(추가 정보)
    private Timestamp suspendedUntil;
}
