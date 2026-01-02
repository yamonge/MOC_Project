package com.cucook.moc.chat.dto;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatRoomSummaryDTO {

    private Long chatRoomId;
    private Long shoppingPostId;
    private Long hostUserId;         // 방장(게시글 작성자) ID
    private String placeName;        // 게시글/장소 이름

    private String lastMessage;      // 마지막 메시지
    private String lastSenderNickname; // 마지막 보낸 사람 닉네임
    private Integer unreadCount;     // 안 읽은 메시지 수 (선택)
    private String statusCd;         // OPEN / DONE / CANCELED
    private Timestamp updatedAt; // 마지막 활동 시간
}
