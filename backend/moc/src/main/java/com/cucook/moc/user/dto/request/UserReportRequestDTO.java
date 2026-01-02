package com.cucook.moc.user.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReportRequestDTO {
    private Long reportedUserId;   // 신고 대상 사용자의 ID (필수)
    private String reportReasonCd; // 신고 사유 코드 (필수)
    private String reportComment;  // 상세 신고 내용
}