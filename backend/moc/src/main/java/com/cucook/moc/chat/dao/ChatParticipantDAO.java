package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatParticipantDTO;
import com.cucook.moc.chat.vo.ChatParticipantVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatParticipantDAO extends JpaRepository<ChatParticipantVO, Long> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
            "FROM ChatParticipantVO p " +
            "WHERE p.chatRoomId = :chatRoomId AND p.userId = :userId AND p.leaveDate IS NULL")
    boolean existsByRoomAndUser(@Param("chatRoomId") Long chatRoomId,
                                @Param("userId") Long userId);

    @Query(value = "SELECT " +
            "p.user_id AS userId, " +
            "u.user_nickname AS nickname, " +
            "u.rating_score AS ratingScore, " +
            "u.user_profile_image_url AS profileImageUrl, " +
            "CASE WHEN sp.writer_user_id = p.user_id THEN true ELSE false END AS isOwner " +
            "FROM tb_shopping_participant p " +
            "JOIN tb_user u ON p.user_id = u.user_id " +
            "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
            "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
            "WHERE p.chat_room_id = :chatRoomId AND p.leave_date IS NULL", nativeQuery = true)
    List<ChatParticipantDTO> selectParticipantInfos(@Param("chatRoomId") Long chatRoomId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
            "FROM tb_shopping_participant p " +
            "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
            "WHERE r.shopping_post_id = :shoppingPostId " +
            "AND p.user_id = :userId AND p.leave_date IS NULL", nativeQuery = true)
    boolean existsByPostAndUser(@Param("shoppingPostId") Long shoppingPostId,
                                @Param("userId") Long userId);

    @Query("SELECT p.userId FROM ChatParticipantVO p " +
            "WHERE p.chatRoomId = :chatRoomId AND p.leaveDate IS NULL")
    List<Long> selectUserIdsByRoom(@Param("chatRoomId") Long chatRoomId);

    @Modifying
    @Transactional
    @Query("UPDATE ChatParticipantVO p SET p.leaveDate = CURRENT_TIMESTAMP " +
            "WHERE p.chatRoomId = :chatRoomId AND p.userId = :userId")
    void updateLeaveDate(@Param("chatRoomId") Long chatRoomId,
                         @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE ChatParticipantVO p SET p.leaveDate = CURRENT_TIMESTAMP " +
            "WHERE p.chatRoomId = :chatRoomId AND p.leaveDate IS NULL")
    void bulkUpdateLeaveDate(@Param("chatRoomId") Long chatRoomId);
}
