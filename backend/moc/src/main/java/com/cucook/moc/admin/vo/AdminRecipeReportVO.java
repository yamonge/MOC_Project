package com.cucook.moc.admin.vo;

import java.sql.Timestamp;

/**
 * 레시피 신고 이력 프로젝션 인터페이스
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface AdminRecipeReportVO {

    Long getRecipeReportId();
    Long getRecipeId();
    Long getReporterUserId();
    String getReportReasonCd();
    String getContent();
    String getStatusCd();
    Timestamp getCreatedDate();
    Timestamp getUpdatedDate();
    String getReporterNickname();
    String getRecipeTitle();
    Long getRecipeOwnerUserId();
    String getRecipeOwnerNickname();
}
