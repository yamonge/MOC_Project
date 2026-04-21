package com.cucook.moc.shopping.dto;

import java.sql.Timestamp;

/**
 * 주변 게시글 요약 인터페이스 프로젝션
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface ShoppingPostSummaryDTO {

    Long getShoppingPostId();
    String getPlaceName();
    String getPlaceAddress();
    Double getLatitude();
    Double getLongitude();
    Timestamp getMeetDatetime();
    Integer getMaxPersonCnt();
    Integer getCurrentPersonCnt();
    String getStatusCd();
    Long getWriterUserId();
    String getWriterNickname();
    Timestamp getCreatedDate();
    String getDescription();
    String getCategoryCodesCsv();
    Double getDistanceMeters();
    Integer getIsParticipated();
}
