package com.cucook.moc.user.dto.request;

import java.sql.Timestamp;
import java.time.LocalDate;

import lombok.*;

/*
 * 회원가입 요청 DTO
 * 이메일 유저이름 닉네임 비밀번호 비밀번호확인 생년월일
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class SignupRequestDTO{
    private String fcmToken;
    private String userEmail;        // 이메일
    private String userName;
    private String userNickname;
    private String userPassword;
    private String passwordConfirm;  // 비밀번호 확인
    private Timestamp userBirthDate; // 생년월일 (yyyy-MM-dd)
}
