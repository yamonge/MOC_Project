package com.cucook.moc.chat.dto;

import java.sql.Timestamp;

/**
 * 채팅 메시지 조회 네이티브 쿼리 프로젝션 인터페이스
 */
public interface ChatMessageProjection {

    Long getMessageId();
    Long getChatRoomId();
    Long getSenderUserId();
    String getSenderNickname();
    String getMessageTypeCd();
    String getMessageText();
    Timestamp getSentDate();
}
