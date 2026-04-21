package com.cucook.moc.shopping.service;

import com.cucook.moc.chat.dao.ChatParticipantDAO;
import com.cucook.moc.shopping.dao.ShoppingPostJoinDAO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.chat.service.ShoppingChatRoomService;
import com.cucook.moc.common.FirebaseService;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.vo.UserVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShoppingPostJoinService {

    private static final Logger log = LoggerFactory.getLogger(ShoppingPostJoinService.class);

    @Autowired
    private ShoppingPostJoinDAO shoppingPostJoinDAO;

    @Autowired
    private ChatParticipantDAO chatParticipantDAO;

    @Autowired
    private ShoppingChatRoomService shoppingChatRoomService;

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Long joinPost(Long postId, Long userId) {

        ShoppingPostVO postVO = shoppingPostJoinDAO.selectPostForUpdate(postId).orElse(null);

        if (postVO == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        if (!"OPEN".equals(postVO.getStatusCd())) {
            throw new IllegalStateException("모집 중이 아닌 게시글입니다.");
        }

        if (postVO.getCurrentPersonCnt() >= postVO.getMaxPersonCnt()) {
            throw new IllegalStateException("이미 인원이 마감된 게시글입니다.");
        }

        Long chatRoomIdCheck = shoppingPostJoinDAO.selectChatRoomIdByPostId(postId);
        if (chatRoomIdCheck != null) {
            boolean alreadyJoined = chatParticipantDAO.existsByPostAndUser(postId, userId);
            if (alreadyJoined) {
                return chatRoomIdCheck;
            }
        }

        shoppingPostJoinDAO.increaseCurrentPersonCnt(postId);

        Long chatRoomId = shoppingPostJoinDAO.selectChatRoomIdByPostId(postId);
        if (chatRoomId == null) {
            throw new IllegalStateException("해당 게시글의 채팅방이 존재하지 않습니다.");
        }

        shoppingChatRoomService.joinRoom(chatRoomId, userId);

        try {
            UserVO joinUser = userRepository.findById(userId).orElse(null);
            UserVO writerUser = userRepository.findById(postVO.getWriterUserId()).orElse(null);
            
            if (writerUser != null 
                && !userId.equals(postVO.getWriterUserId())
                && writerUser.getFcmToken() != null 
                && !writerUser.getFcmToken().isEmpty()) {
                
                String joinUserNickname = (joinUser != null && joinUser.getUserNickname() != null) 
                    ? joinUser.getUserNickname() 
                    : "새로운 참여자";
                
                String title = "🛒 같이 장보기 참여 알림";
                String body = String.format("%s님이 '%s'에 참여했습니다!", 
                    joinUserNickname, 
                    postVO.getPlaceName() != null ? postVO.getPlaceName() : "장보기"
                );
                
                java.util.Map<String, String> data = new java.util.HashMap<>();
                data.put("chatRoomId", String.valueOf(chatRoomId));
                data.put("storeName", postVO.getPlaceName() != null ? postVO.getPlaceName() : "장보기");
                data.put("type", "JOIN");
                
                firebaseService.sendPushNotificationWithData(
                    writerUser.getFcmToken(), 
                    title, 
                    body,
                    data
                );
                
                log.info("푸시 알림 전송 완료: {}에게 전송 (chatRoomId: {})", writerUser.getUserNickname(), chatRoomId);
            }
        } catch (Exception e) {
            log.error("푸시 알림 전송 실패 (참여는 성공): {}", e.getMessage());
        }

        return chatRoomId;
    }
}
