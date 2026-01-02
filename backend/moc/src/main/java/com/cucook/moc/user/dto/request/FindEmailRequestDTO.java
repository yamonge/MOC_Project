package com.cucook.moc.user.dto.request;

import lombok.*;

import java.sql.Timestamp;


/*
* 아이디(이메일)찾기 : 유저이름 + 생년월일
* */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class FindEmailRequestDTO {
    private String userName;
    private Timestamp userBirthDate;
}
