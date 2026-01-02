package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.vo.ChatMessageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMessageDAO {

    void insertMessage(ChatMessageVO vo);

    List<ChatMessageDTO> selectMessagesByRoom(
            @Param("chatRoomId") Long chatRoomId,
            @Param("limit") int limit
    );
}
