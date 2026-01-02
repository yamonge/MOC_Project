package com.cucook.moc.chat.service;

import com.cucook.moc.chat.dao.ChatMessageDAO;
import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.chat.dao.ChatRoomDAO;
import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.vo.ChatMessageVO;
import com.cucook.moc.chat.vo.ChatRoomVO;
import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingChatMessageService {

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
    private UserDAO userDAO;  // 닉네임 조회용 (이메일 X)

    @Autowired
    private FirebaseService firebaseService;

    /**
     * 채팅 메시지 전송
     * - 참여자 검증
     * - DB 저장
     * - STOMP 브로드캐스트
     */
    public void sendMessage(ChatMessageDTO dto) {

        // 1) 참여자 검증
        boolean isParticipant = chatParticipantDAO.existsByRoomAndUser(
                dto.getChatRoomId(),
                dto.getSenderUserId()
        );
        if (!isParticipant) {
            throw new IllegalStateException("채팅방 참여자가 아닙니다.");
        }

        // 2) DB 저장
        ChatMessageVO messageVO = new ChatMessageVO();
        messageVO.setChatRoomId(dto.getChatRoomId());
        messageVO.setSenderUserId(dto.getSenderUserId());
        messageVO.setMessageTypeCd(dto.getMessageTypeCd());
        messageVO.setMessageText(dto.getMessageText());
        messageVO.setSentDate(new Timestamp(System.currentTimeMillis()));

        chatMessageDAO.insertMessage(messageVO);

        // 3) senderNickname 조회 (UserDAO로)
        UserVO sender = userDAO.selectById(dto.getSenderUserId());
        String senderNickname = sender != null ? sender.getUserNickname() : "알수없음";

        // 4) DTO에 필드 설정 (프론트 요구사항)
        dto.setMessageId(messageVO.getChatMessageId());  // ✅ DB에서 생성된 ID
        dto.setSenderNickname(senderNickname);
        dto.setSentDate(messageVO.getSentDate());
        dto.setCreatedAt(messageVO.getSentDate());       // ✅ 프론트 호환성

        // /topic/room/{chatRoomId} 로 브로드캐스트 (프론트와 일치)
        String destination = "/topic/room/" + dto.getChatRoomId();
        messagingTemplate.convertAndSend(destination, dto);

        // 🔥 5) Firebase 푸시 알림 전송 (발신자 제외)
        try {
            // 채팅방 참여자 UserId 목록 조회
            List<Long> participantIds = chatParticipantDAO.selectUserIdsByRoom(dto.getChatRoomId());
            
            // 발신자 제외
            List<Long> targetUserIds = participantIds.stream()
                    .filter(id -> !id.equals(dto.getSenderUserId()))
                    .collect(Collectors.toList());
            
            if (!targetUserIds.isEmpty()) {
                // FCM Token 조회
                List<String> fcmTokens = userDAO.selectFcmTokensByUserIds(targetUserIds);
                
                if (!fcmTokens.isEmpty()) {
                    // 알림 전송
                    String title = "💬 새로운 메시지";
                    String body = String.format("%s: %s", senderNickname, dto.getMessageText());
                    
                    // 🔥 Data payload 추가 (화면 이동용)
                    // 장소명 조회 필요
                    ChatRoomVO room = chatRoomDAO.selectById(dto.getChatRoomId());
                    String placeName = "채팅방";
                    if (room != null && room.getShoppingPostId() != null) {
                        ShoppingPostVO post = shoppingPostDAO.selectById(room.getShoppingPostId());
                        if (post != null && post.getPlaceName() != null) {
                            placeName = post.getPlaceName();
                        }
                    }
                    
                    java.util.Map<String, String> data = new java.util.HashMap<>();
                    data.put("chatRoomId", String.valueOf(dto.getChatRoomId()));
                    data.put("storeName", placeName);
                    data.put("type", "MESSAGE");
                    
                    firebaseService.sendPushNotificationMultiWithData(fcmTokens, title, body, data);
                    System.out.println("✅ 채팅 메시지 알림 전송 완료: " + fcmTokens.size() + "명 (chatRoomId: " + dto.getChatRoomId() + ")");
                }
            }
        } catch (Exception e) {
            // 알림 전송 실패해도 메시지는 성공으로 처리
            System.err.println("⚠️ 채팅 메시지 알림 전송 실패: " + e.getMessage());
        }
    }
    
    // 과거 메시지 조회
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getRecentMessages(Long roomId, int limit) {
        return chatMessageDAO.selectMessagesByRoom(roomId, limit);
    }
}
