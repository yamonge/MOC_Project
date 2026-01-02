package com.cucook.moc.chat.dao;

import com.cucook.moc.chat.dto.ChatParticipantDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatParticipantDAO {

    // 참여자 등록용
    void insertParticipant(@Param("chatRoomId") Long chatRoomId,
                           @Param("userId") Long userId);

    boolean existsByRoomAndUser(@Param("chatRoomId") Long chatRoomId,
                                @Param("userId") Long userId);

    //  채팅방 참가자 목록 (닉네임/평점 조회용)
    List<ChatParticipantDTO> selectParticipantInfos(@Param("chatRoomId") Long chatRoomId);

    // 특정 장보기(shopping_post)에 해당 유저가 참여했는지 여부
    boolean existsByPostAndUser(@Param("shoppingPostId") Long shoppingPostId,
                                @Param("userId") Long userId);

    // 채팅방 참여자 UserId 목록 조회 (발신자 제외용)
    List<Long> selectUserIdsByRoom(@Param("chatRoomId") Long chatRoomId);

    // 참여자 나가기 (퇴장 시간 업데이트)
    void updateLeaveDate(@Param("chatRoomId") Long chatRoomId,
                        @Param("userId") Long userId);

    // 전체 참여자 강퇴 (방 삭제 시)
    void bulkUpdateLeaveDate(@Param("chatRoomId") Long chatRoomId);
}
