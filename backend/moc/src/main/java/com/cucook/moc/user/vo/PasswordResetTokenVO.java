package com.cucook.moc.user.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PasswordResetTokenVO {

    private Long resetTokenId;
    private Long userId;
    private String resetToken;
    private Timestamp expireDate;   // 토큰 만료일
    private String usedYn;        // 'N' or 'Y'
    private Timestamp createdDate;
    private Timestamp usedDate;
}
