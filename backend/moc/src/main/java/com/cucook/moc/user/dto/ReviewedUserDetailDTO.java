package com.cucook.moc.user.dto; // ⭐ user 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewedUserDetailDTO {
    private Long userId;       // 후기를 남긴 사용자의 ID
    private String nickname;   // 후기를 남긴 사용자의 닉네임
    private String profileImageUrl; // 후기를 남긴 사용자의 프로필 이미지 URL
}