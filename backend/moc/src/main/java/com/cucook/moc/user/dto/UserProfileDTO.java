package com.cucook.moc.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserProfileDTO {

    private Long userId;
    private String userEmail;      // 전체 이메일
    private String userNickname;   // 내 닉네임
    private String userProfileImageUrl; //하단 네비에 보여줄 이미지
}