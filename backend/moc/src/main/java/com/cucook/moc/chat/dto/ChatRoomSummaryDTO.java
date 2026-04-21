package com.cucook.moc.chat.dto;

import java.sql.Timestamp;

/**
 * 내 채팅방 목록 요약 인터페이스 프로젝션
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface ChatRoomSummaryDTO {

    Long getChatRoomId();
    Long getShoppingPostId();
    Long getHostUserId();
    String getPlaceName();
    String getLastMessage();
    String getStatusCd();
    Timestamp getUpdatedAt();
}
