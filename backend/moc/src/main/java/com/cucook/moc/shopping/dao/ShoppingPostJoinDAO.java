package com.cucook.moc.shopping.dao;

import com.cucook.moc.shopping.vo.ShoppingPostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ShoppingPostJoinDAO {

    // 참여 시, 인원/상태 체크 위해 게시글 한 건 조회 (FOR UPDATE)
    ShoppingPostVO selectPostForUpdate(@Param("postId") Long postId);

    // current_person_cnt + 1
    int increaseCurrentPersonCnt(@Param("postId") Long postId);

    // current_person_cnt - 1
    int decreaseCurrentPersonCnt(@Param("postId") Long postId);

    // 게시글에 매핑된 채팅방 ID 조회
    Long selectChatRoomIdByPostId(@Param("postId") Long postId);

    ShoppingPostVO selectById(@Param("postId") Long postId);
}

