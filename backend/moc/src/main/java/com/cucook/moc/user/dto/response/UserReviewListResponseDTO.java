package com.cucook.moc.user.dto.response; // ⭐ user 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewListResponseDTO {
    private List<UserReviewResponseDTO> receivedReviews; // 받은 후기 목록
    private int totalCount;                                   // 전체 받은 후기 개수
}