package com.cucook.moc.chat.controller;

import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.chat.dto.ChatParticipantDTO;
import com.cucook.moc.chat.dto.ChatRoomSummaryDTO;
import com.cucook.moc.chat.service.ShoppingChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat/rooms")
public class ShoppingChatRoomController {

    @Autowired
    private ShoppingChatRoomService shoppingChatRoomService;

    @Autowired
    private ChatParticipantDAO chatParticipantDAO;

    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;

    @GetMapping("/me")
    public List<ChatRoomSummaryDTO> getMyChatRooms(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return shoppingChatRoomService.getMyChatRooms(userId);
    }

    @GetMapping("/{chatRoomId}/participants")
    public ResponseEntity<List<Map<String, Object>>> getParticipants(
            @PathVariable Long chatRoomId) {
        List<ChatParticipantDTO> participants =
            chatParticipantDAO.selectParticipantInfos(chatRoomId);

        List<Map<String, Object>> result = participants.stream()
            .map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("userId", p.getUserId());
                map.put("nickname", p.getNickname());
                map.put("ratingScore", p.getRatingScore());
                map.put("isOwner", p.getIsOwner());
                String profileImageUrl = p.getProfileImageUrl();
                if (profileImageUrl != null && !profileImageUrl.isEmpty()
                        && !profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                    profileImageUrl = serverBaseUrl + profileImageUrl;
                }
                map.put("profileImageUrl", profileImageUrl);
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * 채팅방 나가기
     */
    @PostMapping("/{chatRoomId}/leave")
    public ResponseEntity<Void> leaveChatRoom(
            @PathVariable Long chatRoomId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        shoppingChatRoomService.leaveRoom(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 채팅방 삭제 (방장만 가능)
     */
    @DeleteMapping("/{chatRoomId}")
    public ResponseEntity<Void> deleteChatRoom(
            @PathVariable Long chatRoomId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        shoppingChatRoomService.deleteChatRoom(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 참여자 강퇴 (방장만 가능)
     */
    @PostMapping("/{chatRoomId}/kick")
    public ResponseEntity<Void> kickParticipant(
            @PathVariable Long chatRoomId,
            @RequestParam Long kickUserId,
            Authentication authentication) {
        Long requestUserId = Long.parseLong(authentication.getName());
        shoppingChatRoomService.kickParticipant(chatRoomId, kickUserId, requestUserId);
        return ResponseEntity.ok().build();
    }
}
