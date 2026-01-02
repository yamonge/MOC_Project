package com.cucook.moc.user.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserReviewCreateRequestDTO {
    private Long shoppingPostId; // 어떤 장보기 방에 대한 리뷰인지
    private Integer rating;      // 1~5
    private String comment;      // 선택 입력
}
