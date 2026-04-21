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
@Table(name = "tb_shopping_participant")
public class ChatParticipantVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shoppingParticipantId;

    private Long chatRoomId;
    private Long userId;

    @CreationTimestamp
    private Timestamp joinDate;

    private Timestamp leaveDate;
}
