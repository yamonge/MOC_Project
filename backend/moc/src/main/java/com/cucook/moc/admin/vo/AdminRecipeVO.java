package com.cucook.moc.admin.vo;

import java.sql.Timestamp;

/**
 * 레시피(게시글) 관리 프로젝션 인터페이스
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface AdminRecipeVO {

    Long getRecipeId();
    String getTitle();
    String getIsPublic();
    String getIsDeleted();
    Integer getReportCnt();
    Timestamp getCreatedDate();
    String getOwnerNickname();
}
