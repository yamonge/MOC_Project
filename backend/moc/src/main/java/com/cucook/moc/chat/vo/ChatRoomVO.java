package com.cucook.moc.chat.vo;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatRoomVO {

    private Long chatRoomId;       // tb_shopping_chat_room.chat_room_id
    private Long shoppingPostId;   // 매핑되는 게시글 ID
    private String statusCd;       // OPEN / DONE 등
    private Timestamp createdAt;
    private Timestamp updatedAt;
}

