package com.cucook.moc.user.dto.response;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class MyPageReportItemDTO {

    private String reportType;      // RECIPE | USER
    private Long reportId;
    private String title;           // 카드 제목
    private String targetName;      // "신고 대상: xxx"
    private String reportReasonCd;
    private String reportContent;
    private String statusCd;
    private Timestamp createdDate;
}
