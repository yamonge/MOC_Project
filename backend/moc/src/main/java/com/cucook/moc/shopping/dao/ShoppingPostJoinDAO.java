package com.cucook.moc.shopping.dao;

import com.cucook.moc.shopping.vo.ShoppingPostVO;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ShoppingPostJoinDAO extends JpaRepository<ShoppingPostVO, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShoppingPostVO s WHERE s.shoppingPostId = :postId")
    Optional<ShoppingPostVO> selectPostForUpdate(@Param("postId") Long postId);

    @Modifying
    @Transactional
    @Query("UPDATE ShoppingPostVO s SET s.currentPersonCnt = s.currentPersonCnt + 1 " +
            "WHERE s.shoppingPostId = :postId")
    int increaseCurrentPersonCnt(@Param("postId") Long postId);

    @Modifying
    @Transactional
    @Query("UPDATE ShoppingPostVO s SET s.currentPersonCnt = s.currentPersonCnt - 1 " +
            "WHERE s.shoppingPostId = :postId AND s.currentPersonCnt > 0")
    int decreaseCurrentPersonCnt(@Param("postId") Long postId);

    @Query(value = "SELECT chat_room_id FROM tb_shopping_chat_room " +
            "WHERE shopping_post_id = :postId", nativeQuery = true)
    Long selectChatRoomIdByPostId(@Param("postId") Long postId);
}
