package com.cucook.moc.user.dao;

import java.sql.Timestamp;
import java.util.List;

import com.cucook.moc.user.dto.ReviewedUserDetailDTO;
import com.cucook.moc.user.vo.UserVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<UserVO, Long> {

    UserVO findByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);

    boolean existsByUserNickname(String userNickname);

    @Query(value = "SELECT * FROM tb_user WHERE user_name = :userName AND DATE(user_birth_date) = DATE(:userBirthDate)", nativeQuery = true)
    UserVO findByNameAndBirthDate(@Param("userName") String userName,
                                  @Param("userBirthDate") Timestamp userBirthDate);

    @Query(value = "SELECT * FROM tb_user WHERE user_email = :userEmail AND user_name = :userName AND DATE(user_birth_date) = DATE(:userBirthDate)", nativeQuery = true)
    UserVO findForPasswordReset(@Param("userEmail") String userEmail,
                                @Param("userName") String userName,
                                @Param("userBirthDate") Timestamp userBirthDate);

    @Modifying
    @Transactional
    @Query("UPDATE UserVO u SET u.userPassword = :userPassword, u.updatedDate = CURRENT_TIMESTAMP WHERE u.userId = :userId")
    void updatePassword(@Param("userId") Long userId,
                        @Param("userPassword") String userPassword);

    @Modifying
    @Transactional
    @Query("UPDATE UserVO u SET u.lastLoginDate = CURRENT_TIMESTAMP WHERE u.userId = :userId")
    void updateLastLoginDate(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE UserVO u SET u.fcmToken = :fcmToken, u.deviceOs = :deviceOs, u.deviceVersion = :deviceVersion, " +
           "u.updatedDate = CURRENT_TIMESTAMP, u.updatedId = :userId WHERE u.userId = :userId")
    void updateFcmToken(@Param("userId") Long userId,
                        @Param("fcmToken") String fcmToken,
                        @Param("deviceOs") String deviceOs,
                        @Param("deviceVersion") String deviceVersion);

    @Query("SELECT new com.cucook.moc.user.dto.ReviewedUserDetailDTO(u.userId, u.userNickname, u.userProfileImageUrl) " +
           "FROM UserVO u WHERE u.userId = :userId")
    ReviewedUserDetailDTO selectReviewedUserDetail(@Param("userId") Long userId);

    @Query("SELECT u.fcmToken FROM UserVO u WHERE u.userId IN :userIds AND u.fcmToken IS NOT NULL")
    List<String> selectFcmTokensByUserIds(@Param("userIds") List<Long> userIds);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_user SET rating_score = " +
           "(SELECT COALESCE(AVG(r.rating), 0) FROM tb_user_review r WHERE r.target_user_id = :targetUserId) " +
           "WHERE user_id = :targetUserId", nativeQuery = true)
    void updateRatingScoreByAvg(@Param("targetUserId") Long targetUserId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_user SET user_name = :userName, user_nickname = :userNickname, " +
           "user_profile_image_url = CASE WHEN :userProfileImageUrl IS NULL THEN user_profile_image_url ELSE :userProfileImageUrl END, " +
           "updated_id = :updatedId, updated_date = :updatedDate " +
           "WHERE user_id = :userId", nativeQuery = true)
    void updateUserProfile(@Param("userId") Long userId,
                           @Param("userName") String userName,
                           @Param("userNickname") String userNickname,
                           @Param("userProfileImageUrl") String userProfileImageUrl,
                           @Param("updatedId") Long updatedId,
                           @Param("updatedDate") Timestamp updatedDate);

    @Modifying
    @Transactional
    @Query("UPDATE UserVO u SET u.userStatus = :userStatus, u.updatedId = :updatedId, u.updatedDate = :updatedDate WHERE u.userId = :userId")
    void updateUserStatus(@Param("userId") Long userId,
                          @Param("userStatus") String userStatus,
                          @Param("updatedId") Long updatedId,
                          @Param("updatedDate") Timestamp updatedDate);

    @Modifying
    @Transactional
    @Query("UPDATE UserVO u SET u.userStatus = 'ACTIVE', u.suspendedUntil = NULL, u.suspendedReason = NULL " +
           "WHERE u.userId = :userId AND u.userStatus = 'SUSPENDED' " +
           "AND u.suspendedUntil IS NOT NULL AND u.suspendedUntil <= CURRENT_TIMESTAMP")
    int restoreExpiredSuspensionToActive(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(DISTINCT sp.shopping_post_id) " +
           "FROM tb_shopping_participant p " +
           "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
           "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
           "WHERE p.user_id = :userId AND sp.status_cd = 'DONE' AND p.leave_date IS NULL", nativeQuery = true)
    int countCompletedMeetings(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(DISTINCT sp.shopping_post_id) " +
           "FROM tb_shopping_participant p " +
           "JOIN tb_shopping_chat_room r ON p.chat_room_id = r.chat_room_id " +
           "JOIN tb_shopping_post sp ON r.shopping_post_id = sp.shopping_post_id " +
           "WHERE p.user_id = :userId AND p.leave_date IS NULL", nativeQuery = true)
    int countTotalMeetings(@Param("userId") Long userId);
}
