package com.cucook.moc.shopping.dto;

import java.sql.Timestamp;

/**
 * 게시글 상세 네이티브 쿼리 프로젝션 인터페이스
 */
public interface ShoppingPostDetailProjection {

    Long getShoppingPostId();
    Long getWriterUserId();
    String getWriterNickname();
    String getPlaceName();
    String getPlaceAddress();
    Double getLatitude();
    Double getLongitude();
    Timestamp getMeetDatetime();
    Integer getMinPersonCnt();
    Integer getMaxPersonCnt();
    Integer getCurrentPersonCnt();
    String getStatusCd();
    String getDescription();
}
