package com.cucook.moc.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// 신고된 사용자의 핵심 정보를 담는 DTO (ResultMap의 association 용도)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportedUserDetailDTO {
    private Long userId;          // 신고된 사용자의 ID (reported_user_id)
    private String nickname;      // 신고된 사용자의 닉네임
    private String profileImageUrl; // 신고된 사용자의 프로필 이미지 URL (선택 사항)
}