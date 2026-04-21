package com.cucook.moc.chat.dto;

/**
 * 채팅 참가자 정보 인터페이스 프로젝션
 * - 네이티브 쿼리 결과를 Spring Data JPA 인터페이스 프로젝션으로 매핑
 */
public interface ChatParticipantDTO {

    Long getUserId();
    String getNickname();
    Double getRatingScore();
    Boolean getIsOwner();
    String getProfileImageUrl();
}
