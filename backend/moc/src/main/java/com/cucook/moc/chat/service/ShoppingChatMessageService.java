package com.cucook.moc.chat.service;

import com.cucook.moc.chat.dao.ChatMessageDAO;
import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.chat.dao.ChatRoomDAO;
import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.dto.ChatMessageProjection;
import com.cucook.moc.chat.vo.ChatMessageVO;
import com.cucook.moc.chat.vo.ChatRoomVO;
import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.FirebaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingChatMessageService {

    private static final Logger log = LoggerFactory.getLogger(ShoppingChatMessageService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageDAO chatMessageDAO;

    @Autowired
    private ChatParticipantDAO chatParticipantDAO;

    @Autowired
    private ChatRoomDAO chatRoomDAO;

    @Autowired
    private ShoppingPostDAO shoppingPostDAO;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseService firebaseService;

    public void sendMessage(ChatMessageDTO dto) {

        boolean isParticipant = chatParticipantDAO.existsByRoomAndUser(
                dto.getChatRoomId(),
                dto.getSenderUserId()
        );
        if (!isParticipant) {
            throw new IllegalStateException("채팅방 참여자가 아닙니다.");
        }

        ChatMessageVO messageVO = ChatMessageVO.builder()
                .chatRoomId(dto.getChatRoomId())
                .senderUserId(dto.getSenderUserId())
                .messageTypeCd(dto.getMessageTypeCd())
                .messageText(dto.getMessageText())
                .sentDate(new Timestamp(System.currentTimeMillis()))
                .build();

        ChatMessageVO saved = chatMessageDAO.save(messageVO);

        UserVO sender = userRepository.findById(dto.getSenderUserId()).orElse(null);
        String senderNickname = sender != null ? sender.getUserNickname() : "알수없음";

        dto.setMessageId(saved.getChatMessageId());
        dto.setSenderNickname(senderNickname);
        dto.setSentDate(saved.getSentDate());
        dto.setCreatedAt(saved.getSentDate());

        String destination = "/topic/room/" + dto.getChatRoomId();
        messagingTemplate.convertAndSend(destination, dto);

        try {
            List<Long> participantIds = chatParticipantDAO.selectUserIdsByRoom(dto.getChatRoomId());
            
            List<Long> targetUserIds = participantIds.stream()
                    .filter(id -> !id.equals(dto.getSenderUserId()))
                    .collect(Collectors.toList());
            
            if (!targetUserIds.isEmpty()) {
                List<String> fcmTokens = userRepository.selectFcmTokensByUserIds(targetUserIds);
                
                if (!fcmTokens.isEmpty()) {
                    String title = "💬 새로운 메시지";
                    String body = String.format("%s: %s", senderNickname, dto.getMessageText());
                    
                    ChatRoomVO room = chatRoomDAO.findById(dto.getChatRoomId()).orElse(null);
                    String placeName = "채팅방";
                    if (room != null && room.getShoppingPostId() != null) {
                        ShoppingPostVO post = shoppingPostDAO.findById(room.getShoppingPostId()).orElse(null);
                        if (post != null && post.getPlaceName() != null) {
                            placeName = post.getPlaceName();
                        }
                    }
                    
                    java.util.Map<String, String> data = new java.util.HashMap<>();
                    data.put("chatRoomId", String.valueOf(dto.getChatRoomId()));
                    data.put("storeName", placeName);
                    data.put("type", "MESSAGE");
                    
                    firebaseService.sendPushNotificationMultiWithData(fcmTokens, title, body, data);
                    log.info("채팅 메시지 알림 전송 완료: {}명 (chatRoomId: {})", fcmTokens.size(), dto.getChatRoomId());
                }
            }
        } catch (Exception e) {
            log.error("채팅 메시지 알림 전송 실패: {}", e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getRecentMessages(Long roomId, int limit) {
        List<ChatMessageProjection> projections = chatMessageDAO.selectMessagesByRoom(roomId, limit);
        return projections.stream().map(p -> ChatMessageDTO.builder()
                .messageId(p.getMessageId())
                .chatRoomId(p.getChatRoomId())
                .senderUserId(p.getSenderUserId())
                .senderNickname(p.getSenderNickname())
                .messageTypeCd(p.getMessageTypeCd())
                .messageText(p.getMessageText())
                .sentDate(p.getSentDate())
                .createdAt(p.getSentDate())
                .build()
        ).collect(Collectors.toList());
    }
}
