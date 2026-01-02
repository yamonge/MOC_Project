package com.cucook.moc.user.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserReviewDTO {

    private Long userReviewId;
    private Long writerUserId;
    private String writerNickname;   // 리뷰 작성자 닉네임
    private String writerProfileImageUrl; // 리뷰 작성자 프로필 이미지 URL
    private Integer rating;
    private String comment;
    private Timestamp createdDate;
}
