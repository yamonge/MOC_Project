package com.cucook.moc.user.dao;

import com.cucook.moc.user.dto.UserReviewDTO;
import com.cucook.moc.user.vo.UserReviewVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserReviewRepository extends JpaRepository<UserReviewVO, Long> {

    List<UserReviewVO> findByTargetUserId(Long targetUserId);

    int countByTargetUserId(Long targetUserId);

    boolean existsByTargetUserIdAndWriterUserIdAndShoppingPostId(Long targetUserId, Long writerUserId, Long shoppingPostId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserReviewVO r WHERE r.userReviewId = :userReviewId AND r.writerUserId = :writerUserId")
    int deleteByUserReviewIdAndWriterUserId(@Param("userReviewId") Long userReviewId,
                                            @Param("writerUserId") Long writerUserId);

    int countByShoppingPostIdAndWriterUserIdAndTargetUserId(Long shoppingPostId, Long writerUserId, Long targetUserId);

    @Query("SELECT new com.cucook.moc.user.dto.UserReviewDTO(" +
           "ur.userReviewId, ur.writerUserId, u.userNickname, u.userProfileImageUrl, " +
           "ur.rating, ur.userReviewComment, ur.createdDate) " +
           "FROM UserReviewVO ur, UserVO u " +
           "WHERE ur.writerUserId = u.userId AND ur.targetUserId = :targetUserId " +
           "ORDER BY ur.createdDate DESC")
    List<UserReviewDTO> selectReviewsForUser(@Param("targetUserId") Long targetUserId);
}
