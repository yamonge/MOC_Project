package com.cucook.moc.admin.vo;

import java.sql.Timestamp;

/**
 * 관리자 회원 관리에서 사용하는 회원 정보 프로젝션 인터페이스
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface AdminUserVO {

    Long getUserId();
    String getUserEmail();
    String getUserName();
    String getUserNickname();
    String getUserType();
    String getUserStatus();
    Integer getReportedCnt();
    Timestamp getSuspendedUntil();
    String getSuspendedReason();
    Timestamp getCreatedDate();
}
