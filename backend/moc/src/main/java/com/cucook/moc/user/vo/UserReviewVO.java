// com.cucook.moc.user.vo.UserReviewVO

package com.cucook.moc.user.vo;

import java.sql.Timestamp;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserReviewVO {

    private Long userReviewId;
    private Long targetUserId;
    private Long writerUserId;
    private Long shoppingPostId;
    private Integer rating;
    private String userReviewComment;
    private Timestamp createdDate;
}
