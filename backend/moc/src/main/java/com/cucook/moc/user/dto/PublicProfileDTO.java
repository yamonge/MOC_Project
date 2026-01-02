package com.cucook.moc.user.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PublicProfileDTO {
    private Long userId;                // 유저 식별용
    private String userNickname;        // 닉네임 (타인이 보는 이름)
    private Double ratingScore;         // 평균 평점 (tb_user.rating_score)
    private Integer shoppingCompletedCnt; // 장보기 완료 횟수 (tb_user.shopping_completed_cnt)
    private Integer attendanceRate;     // 참석률 (완료 / 참여 * 100)
    private java.util.Date createdDate; // 가입일
    private Integer reviewCnt;          // 후기 개수
    private String profileImageUrl;     // 프로필 이미지 URL
}
