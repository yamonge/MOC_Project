package com.cucook.moc.chat.service;

import com.cucook.moc.chat.dao.ChatRoomDAO;
import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.chat.dto.ChatRoomSummaryDTO;
import com.cucook.moc.chat.dto.ChatMessageDTO;
import com.cucook.moc.chat.vo.ChatRoomVO;
import com.cucook.moc.chat.vo.ChatParticipantVO;
import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import com.cucook.moc.shopping.dao.ShoppingPostJoinDAO;
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

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShoppingChatRoomService {

    private static final Logger log = LoggerFactory.getLogger(ShoppingChatRoomService.class);

    private static LocalDateTime lastAutoCompleteTime = null;
    private static final int CHECK_INTERVAL_MINUTES = 10;

    @Autowired
    private ChatRoomDAO chatRoomDAO;

    @Autowired
    private ChatParticipantDAO chatParticipantDAO;

    @Autowired
    private ShoppingPostDAO shoppingPostDAO;

    @Autowired
    private ShoppingPostJoinDAO shoppingPostJoinDAO;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Long createRoomForPost(Long shoppingPostId, Long hostUserId) {

        ChatRoomVO roomVO = ChatRoomVO.builder()
                .shoppingPostId(shoppingPostId)
                .statusCd("OPEN")
                .build();

        ChatRoomVO saved = chatRoomDAO.save(roomVO);
        Long chatRoomId = saved.getChatRoomId();

        ChatParticipantVO participant = ChatParticipantVO.builder()
                .chatRoomId(chatRoomId)
                .userId(hostUserId)
                .build();
        chatParticipantDAO.save(participant);

        return chatRoomId;
    }

    @Transactional
    public void joinRoom(Long chatRoomId, Long userId) {
        boolean exists = chatParticipantDAO.existsByRoomAndUser(chatRoomId, userId);
        if (!exists) {
            ChatParticipantVO participant = ChatParticipantVO.builder()
                    .chatRoomId(chatRoomId)
                    .userId(userId)
                    .build();
            chatParticipantDAO.save(participant);
        }
    }

    @Transactional
    public List<ChatRoomSummaryDTO> getMyChatRooms(Long userId) {
        checkAndAutoCompletePosts();
        return chatRoomDAO.selectRoomsByUser(userId);
    }
    
    private void checkAndAutoCompletePosts() {
        LocalDateTime now = LocalDateTime.now();
        
        if (lastAutoCompleteTime == null || 
            lastAutoCompleteTime.plusMinutes(CHECK_INTERVAL_MINUTES).isBefore(now)) {
            
            log.info("[자동 완료 체크] 시작 - {}", now);
            
            int updatedPosts = shoppingPostDAO.bulkUpdateExpiredPosts();
            
            if (updatedPosts > 0) {
                int updatedRooms = chatRoomDAO.bulkUpdateExpiredRooms();
                log.info("[자동 완료] 게시글 {}개, 채팅방 {}개 처리", updatedPosts, updatedRooms);
            }
            
            lastAutoCompleteTime = now;
        }
    }

    @Transactional
    public void leaveRoom(Long chatRoomId, Long userId) {
        boolean exists = chatParticipantDAO.existsByRoomAndUser(chatRoomId, userId);
        if (!exists) {
            throw new IllegalStateException("채팅방 참여자가 아닙니다.");
        }

        ChatRoomVO room = chatRoomDAO.findById(chatRoomId).orElse(null);
        if (room != null && room.getShoppingPostId() != null) {
            shoppingPostJoinDAO.decreaseCurrentPersonCnt(room.getShoppingPostId());
        }

        chatParticipantDAO.updateLeaveDate(chatRoomId, userId);
    }

    @Transactional
    public void deleteChatRoom(Long chatRoomId, Long requestUserId) {
        ChatRoomVO room = chatRoomDAO.findById(chatRoomId).orElse(null);
        if (room == null) {
            throw new IllegalArgumentException("존재하지 않는 채팅방입니다.");
        }

        Long postOwnerId = shoppingPostDAO.selectOwnerUserId(room.getShoppingPostId());
        if (!postOwnerId.equals(requestUserId)) {
            throw new IllegalStateException("채팅방 삭제 권한이 없습니다.");
        }

        ShoppingPostVO post = shoppingPostDAO.findById(room.getShoppingPostId()).orElse(null);
        String placeName = post != null ? post.getPlaceName() : "장보기";

        chatParticipantDAO.bulkUpdateLeaveDate(chatRoomId);

        chatRoomDAO.updateStatus(chatRoomId, "DELETED");

        if (room.getShoppingPostId() != null) {
            shoppingPostDAO.updateStatus(room.getShoppingPostId(), "CANCELED");
            log.info("[게시글 상태 변경] postId: {} -> CANCELED", room.getShoppingPostId());
        }

        try {
            List<Long> participantIds = chatParticipantDAO.selectUserIdsByRoom(chatRoomId);
            List<Long> targetUserIds = participantIds.stream()
                    .filter(id -> !id.equals(requestUserId))
                    .collect(java.util.stream.Collectors.toList());

            if (!targetUserIds.isEmpty()) {
                List<String> fcmTokens = userRepository.selectFcmTokensByUserIds(targetUserIds);
                if (!fcmTokens.isEmpty()) {
                    firebaseService.sendPushNotificationMulti(
                            fcmTokens,
                            "⚠️ 채팅방 폐기 알림",
                            "'" + placeName + "' 모임이 취소되었습니다."
                    );
                    log.info("방 삭제 알림 전송 완료: {}명", fcmTokens.size());
                }
            }
        } catch (Exception e) {
            log.error("방 삭제 알림 전송 실패: {}", e.getMessage());
        }

        try {
            ChatMessageDTO systemMsg = ChatMessageDTO.systemMessage(
                    "방장이 채팅방을 폐기했습니다.",
                    "ROOM_KICKED"
            );
            String destination = "/topic/room/" + chatRoomId;
            messagingTemplate.convertAndSend(destination, systemMsg);
            log.info("방 삭제 WebSocket 메시지 전송 완료");
        } catch (Exception e) {
            log.error("방 삭제 WebSocket 메시지 전송 실패: {}", e.getMessage());
        }
    }

    @Transactional
    public void kickParticipant(Long chatRoomId, Long kickUserId, Long requestUserId) {
        ChatRoomVO room = chatRoomDAO.findById(chatRoomId).orElse(null);
        if (room == null) {
            throw new IllegalArgumentException("존재하지 않는 채팅방입니다.");
        }

        Long postOwnerId = shoppingPostDAO.selectOwnerUserId(room.getShoppingPostId());
        if (!postOwnerId.equals(requestUserId)) {
            throw new IllegalStateException("참여자 강퇴 권한이 없습니다.");
        }

        boolean exists = chatParticipantDAO.existsByRoomAndUser(chatRoomId, kickUserId);
        if (!exists) {
            throw new IllegalStateException("강퇴할 참여자가 존재하지 않습니다.");
        }

        chatParticipantDAO.updateLeaveDate(chatRoomId, kickUserId);

        if (room.getShoppingPostId() != null) {
            shoppingPostJoinDAO.decreaseCurrentPersonCnt(room.getShoppingPostId());
        }

        try {
            UserVO kickedUser = userRepository.findById(kickUserId).orElse(null);
            if (kickedUser != null && kickedUser.getFcmToken() != null && !kickedUser.getFcmToken().isEmpty()) {
                firebaseService.sendPushNotification(
                        kickedUser.getFcmToken(),
                        "⚠️ 채팅방 강퇴 알림",
                        "방장에 의해 채팅방에서 강퇴되었습니다."
                );
                log.info("강퇴 알림 전송 완료: {}", kickedUser.getUserNickname());
            }
        } catch (Exception e) {
            log.error("강퇴 알림 전송 실패: {}", e.getMessage());
        }

        try {
            ChatMessageDTO kickMsg = ChatMessageDTO.kickMessage(
                    "방장에 의해 강퇴되었습니다.",
                    "USER_KICKED",
                    kickUserId
            );
            String destination = "/topic/room/" + chatRoomId;
            messagingTemplate.convertAndSend(destination, kickMsg);
            log.info("강퇴 WebSocket 메시지 전송 완료");
        } catch (Exception e) {
            log.error("강퇴 WebSocket 메시지 전송 실패: {}", e.getMessage());
        }
    }
}
