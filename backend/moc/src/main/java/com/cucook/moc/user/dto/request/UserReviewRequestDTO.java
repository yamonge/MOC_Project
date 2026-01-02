package com.cucook.moc.user.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewRequestDTO {
    private Long targetUserId;      // ⭐ 후기를 남길 대상 사용자의 ID (필수)
    private Long shoppingPostId;    // ⭐ 어떤 장보기 게시글(세션)에 대한 후기인지 (필수)
    private Integer rating;         // ⭐ 별점 (1~5점, 필수)
    private String userReviewComment; // ⭐ 후기 내용
}