package com.cucook.moc.chat.controller;

import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.service.ShoppingChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

// WebSocket STOMP - 채팅 메시지 전송
@Controller
public class ShoppingChatStompController {

    @Autowired
    private ShoppingChatMessageService shoppingChatMessageService;

    /**
     * 클라이언트: /app/chat.sendMessage 로 SEND (프론트와 일치)
     * payload: { chatRoomId, senderUserId, messageTypeCd, messageText }
     * senderNickname은 서버에서 UserDAO로 조회해서 세팅
     */
    @MessageMapping("/chat.sendMessage")
    public void handleChatMessage(ChatMessageDTO dto) {
        shoppingChatMessageService.sendMessage(dto);
    }
}
