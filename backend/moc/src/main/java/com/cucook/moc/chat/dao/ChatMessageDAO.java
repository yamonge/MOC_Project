package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatMessageProjection;
import com.cucook.moc.chat.vo.ChatMessageVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageDAO extends JpaRepository<ChatMessageVO, Long> {

    @Query(value = "SELECT " +
            "m.chat_message_id AS messageId, " +
            "m.chat_room_id AS chatRoomId, " +
            "m.sender_user_id AS senderUserId, " +
            "u.user_nickname AS senderNickname, " +
            "m.message_type_cd AS messageTypeCd, " +
            "m.message_text AS messageText, " +
            "m.sent_date AS sentDate " +
            "FROM tb_shopping_chat_message m " +
            "LEFT JOIN tb_user u ON m.sender_user_id = u.user_id " +
            "WHERE m.chat_room_id = :chatRoomId " +
            "ORDER BY m.sent_date DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<ChatMessageProjection> selectMessagesByRoom(
            @Param("chatRoomId") Long chatRoomId,
            @Param("limit") int limit
    );
}
