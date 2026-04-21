package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatRoomSummaryDTO;
import com.cucook.moc.chat.vo.ChatRoomVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatRoomDAO extends JpaRepository<ChatRoomVO, Long> {

    @Query("SELECT c.chatRoomId FROM ChatRoomVO c WHERE c.shoppingPostId = :shoppingPostId")
    Long selectChatRoomIdByPost(@Param("shoppingPostId") Long shoppingPostId);

    @Query(value = "SELECT " +
            "r.chat_room_id AS chatRoomId, " +
            "r.shopping_post_id AS shoppingPostId, " +
            "sp.writer_user_id AS hostUserId, " +
            "sp.place_name AS placeName, " +
            "( SELECT m.message_text FROM tb_shopping_chat_message m " +
            "  WHERE m.chat_room_id = r.chat_room_id " +
            "  ORDER BY m.sent_date DESC LIMIT 1 " +
            ") AS lastMessage, " +
            "r.status_cd AS statusCd, " +
            "r.updated_at AS updatedAt " +
            "FROM tb_shopping_chat_room r " +
            "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
            "JOIN tb_shopping_participant p ON p.chat_room_id = r.chat_room_id " +
            "WHERE p.user_id = :userId AND p.leave_date IS NULL " +
            "ORDER BY r.updated_at DESC", nativeQuery = true)
    List<ChatRoomSummaryDTO> selectRoomsByUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE ChatRoomVO c SET c.statusCd = :statusCd, c.updatedAt = CURRENT_TIMESTAMP " +
            "WHERE c.chatRoomId = :chatRoomId")
    void updateStatus(@Param("chatRoomId") Long chatRoomId, @Param("statusCd") String statusCd);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_shopping_chat_room r SET r.status_cd = 'DONE', r.updated_at = CURRENT_TIMESTAMP " +
            "WHERE r.status_cd = 'OPEN' AND EXISTS ( " +
            "  SELECT 1 FROM tb_shopping_post p " +
            "  WHERE p.shopping_post_id = r.shopping_post_id AND p.status_cd = 'DONE' " +
            ")", nativeQuery = true)
    int bulkUpdateExpiredRooms();
}
