package com.cucook.moc.user.dto.request;

import lombok.*;

// 설정화면 - 프로필 수정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdateProfileRequestDTO {
    //  RN(ProfileEditScreen)에서 보내는 키와 동일하게 맞춤
    private String name;
    private String nickname;
    private String profileImage; // URL 또는 Base64(현재는 문자열 그대로 저장)
}
