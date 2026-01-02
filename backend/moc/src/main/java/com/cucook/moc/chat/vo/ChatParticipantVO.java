package com.cucook.moc.chat.vo;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatParticipantVO {
    private Long shoppingParticipantId;
    private Long chatRoomId;
    private Long userId;
    private Timestamp joinDate;
    private Timestamp leaveDate;
}

