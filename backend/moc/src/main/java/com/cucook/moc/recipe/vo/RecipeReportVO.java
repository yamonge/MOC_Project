package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RecipeReportVO {

    private Long reportId;          // DDL: recipe_report_id NUMBER(19) -> Java Long
    private Long recipeId;          // DDL: recipe_id NUMBER(19)       -> Java Long
    private Long reporterUserId;    // DDL: reporter_user_id NUMBER(19) -> Java Long
    private String reporterNickname; // 신고자 닉네임 (JOIN으로 조회)
    private String reportReasonCd;  // DDL: report_reason_cd VARCHAR2(20) -> Java String
    private String content;         // DDL: content VARCHAR2(1000)      -> Java String
    private String statusCd;        // DDL: status_cd VARCHAR2(20)      -> Java String
    private Long createdId;         // DDL: created_id NUMBER(19)       -> Java Long
    private Timestamp createdDate;  // DDL: created_date TIMESTAMP(6)   -> Java Timestamp
    private Long updatedId;         // DDL: updated_id NUMBER(19)       -> Java Long
    private Timestamp updatedDate;  // DDL: updated_date TIMESTAMP(6)   -> Java Timestamp
}