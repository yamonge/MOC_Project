package com.cucook.moc.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserSettingsInfoResponseDTO {
    // RN에서 그대로 쓰도록 name/nickname/email/role/profileImage로 맞춤
    private String name;
    private String nickname;
    private String email;
    private String role;         // "admin" | "user"
    private String profileImage; // user_profile_image_url
}
