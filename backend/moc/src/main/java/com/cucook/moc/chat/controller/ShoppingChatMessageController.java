package com.cucook.moc.chat.controller;

import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.service.ShoppingChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST - 과거 메시지 조회
@RestController
@RequestMapping("/api/chat/messages")
public class ShoppingChatMessageController {

    @Autowired
    private ShoppingChatMessageService shoppingChatMessageService;

    /**
     * 채팅방 과거 메시지 조회
     */
    @GetMapping("/{chatRoomId}")
    public List<ChatMessageDTO> getMessages(
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return shoppingChatMessageService.getRecentMessages(chatRoomId, limit);
    }

    // 테스트용: REST로 채팅 메시지 전송
    @PostMapping("/send")
    public void sendMessage(@RequestBody ChatMessageDTO dto) {
        // dto.chatRoomId, dto.senderUserId, dto.messageTypeCd, dto.messageText 필요
        shoppingChatMessageService.sendMessage(dto);
    }
}
