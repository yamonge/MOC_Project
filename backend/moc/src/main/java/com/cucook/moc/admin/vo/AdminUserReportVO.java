package com.cucook.moc.admin.vo;

import java.sql.Timestamp;

/**
 * 사용자 신고 이력 프로젝션 인터페이스
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface AdminUserReportVO {

    Long getUserReportId();
    Long getReporterUserId();
    Long getReportedUserId();
    String getReportReasonCd();
    String getReportComment();
    String getProcessingStatusCd();
    Timestamp getCreatedDate();
    Timestamp getProcessedDate();
    Long getProcessorId();
    String getReporterNickname();
    String getReportedNickname();
}
