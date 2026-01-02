package com.cucook.moc.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyPageCountResponseDTO {

    private int ingredientCount;       // 재료 관리
    private int savedRecipeCount;       // 저장한 게시글
    private int sharedRecipeCount;      // 공유한 게시글
    private int receivedReviewCount;    // 받은 후기
    private int reportCount;            // 내가 한 신고
    private int completedMeetingCount;  // 완료된 모임 수
    private double attendanceRate;      // 참석률 (0.0 ~ 100.0)
}
