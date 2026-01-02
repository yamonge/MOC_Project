package com.cucook.moc.admin.dto.response;

import lombok.*;

import java.util.List;

/**
 * ✅ 프론트가 response.users로 접근하므로 wrapper 형태 필수
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminUserListResponseDTO {
    private List<AdminUserListItemResponseDTO> users;

    // cursor 기반 확장용(프론트가 당장 안 써도 무방)
    private Long nextCursor;
}
