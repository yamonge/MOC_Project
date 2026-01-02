package com.cucook.moc.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.time.LocalDate;

/*
* 비밀번호 찾기 : 이메일 + 유저이름 + 생년월일
* */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class FindPasswordRequestDTO {
    private String userEmail;
    private String userName;
    private Timestamp userBirthDate;
}
