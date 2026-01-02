package com.cucook.moc.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// 회원가입시 닉네임 체크용
@Getter
@Setter
@NoArgsConstructor
@ToString
public class CheckNicknameRequestDTO {
    private String userNickname;
}
