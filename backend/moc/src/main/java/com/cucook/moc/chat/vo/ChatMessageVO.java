package com.cucook.moc.chat.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "tb_shopping_chat_message")
public class ChatMessageVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatMessageId;

    private Long chatRoomId;
    private Long senderUserId;

    @Column(length = 20)
    private String messageTypeCd;

    private String messageText;

    @CreationTimestamp
    private Timestamp sentDate;
}
