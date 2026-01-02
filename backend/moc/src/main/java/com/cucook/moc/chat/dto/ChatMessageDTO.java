package com.cucook.moc.chat.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatMessageDTO {

    private Long messageId;          // ✅ 프론트 요구: 메시지 고유 ID
    private Long chatRoomId;
    private Long senderUserId;      // 내부 식별용
    private String senderNickname;   // 프론트에 보여줄 닉네임
    private String messageTypeCd;    // TEXT / SYSTEM 등
    private String messageText;
    private Timestamp sentDate;      // 서버에서 세팅
    private Timestamp createdAt;     // ✅ 프론트 요구: ISO 8601 형식
    private String action;           // ✅ 시스템 메시지 액션 (ROOM_KICKED, USER_KICKED)
    private Long targetUserId;       // ✅ 강퇴 대상 userId

    /**
     * 시스템 메시지 생성 헬퍼 메서드
     */
    public static ChatMessageDTO systemMessage(String messageText, String action) {
        return ChatMessageDTO.builder()
                .messageTypeCd("SYSTEM")
                .messageText(messageText)
                .action(action)
                .sentDate(new Timestamp(System.currentTimeMillis()))
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    /**
     * 강퇴 시스템 메시지 생성 헬퍼 메서드
     */
    public static ChatMessageDTO kickMessage(String messageText, String action, Long targetUserId) {
        return ChatMessageDTO.builder()
                .messageTypeCd("SYSTEM")
                .messageText(messageText)
                .action(action)
                .targetUserId(targetUserId)
                .sentDate(new Timestamp(System.currentTimeMillis()))
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }
}
