package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatRoomSummaryDTO;
import com.cucook.moc.chat.vo.ChatRoomVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatRoomDAO {

    void insertChatRoom(ChatRoomVO vo);

    Long selectChatRoomIdByPost(@Param("shoppingPostId") Long shoppingPostId);

    List<ChatRoomSummaryDTO> selectRoomsByUser(@Param("userId") Long userId);

    ChatRoomVO selectById(@Param("chatRoomId") Long chatRoomId);

    void updateStatus(@Param("chatRoomId") Long chatRoomId,
                      @Param("statusCd") String statusCd);

    // 만료된 채팅방 일괄 업데이트
    int bulkUpdateExpiredRooms();
}
