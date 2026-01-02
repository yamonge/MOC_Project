package com.cucook.moc.chat.vo;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatMessageVO {

    private Long chatMessageId;
    private Long chatRoomId;
    private Long senderUserId;
    private String messageTypeCd;   // TEXT / SYSTEM 등
    private String messageText;
    private Timestamp sentDate;
}

