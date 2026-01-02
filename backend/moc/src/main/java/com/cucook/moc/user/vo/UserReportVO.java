package com.cucook.moc.user.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserReportVO {
    private Long reportId;          // DDL: user_report_id NUMBER(19) -> Java Long
    private Long reporterUserId;    // DDL: reporter_user_id NUMBER(19) -> Java Long
    private Long reportedUserId;    // DDL: reported_user_id NUMBER(19) -> Java Long
    private String reportReasonCd;  // DDL: report_reason_cd VARCHAR2(20) -> Java String
    private String reportComment;   // DDL: report_comment VARCHAR2(1000) -> Java String
    private String processingStatusCd; // DDL: processing_status_cd VARCHAR2(20) -> Java String
    private Long createdId;         // DDL: created_id NUMBER(19)       -> Java Long
    private Timestamp createdDate;  // DDL: created_date TIMESTAMP(6)   -> Java Timestamp
    private Timestamp processedDate; // DDL: processed_date TIMESTAMP(6) -> Java Timestamp (NULL 허용)
    private Long processorId;       // DDL: processor_id NUMBER(19)     -> Java Long (NULL 허용)
}