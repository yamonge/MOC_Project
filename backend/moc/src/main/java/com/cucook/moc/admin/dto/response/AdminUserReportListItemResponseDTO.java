package com.cucook.moc.admin.dto.response;

import lombok.*;
import java.sql.Timestamp;

/**
 * 유저 신고 목록 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminUserReportListItemResponseDTO {

    private Long userReportId;
    private String reportReasonCd;
    private String processingStatusCd;
    private Timestamp createdDate;

    private Long reporterUserId;
    private String reporterNickname;

    private Long reportedUserId;
    private String reportedNickname;

    private String reportComment;
}
