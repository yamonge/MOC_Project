package com.cucook.moc.user.dao;

import java.sql.Timestamp;

import com.cucook.moc.user.dto.ReviewedUserDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cucook.moc.user.vo.UserVO;

@Mapper
public interface UserDAO {

    // 이메일로 유저 조회 (로그인용)
    UserVO findByUserEmail(@Param("userEmail") String userEmail);

    // 이메일 중복 체크
    int countByUserEmail(@Param("userEmail") String userEmail);

    // 회원가입
    void insertUser(UserVO user);

    /**
     * 주어진 닉네임과 같은 값이 DB에 몇 개 있는지 카운트합니다.
     */
    int countByNickname(@Param("userNickname") String userNickname);

    // 이름 + 생년월일로 아이디 찾기
    UserVO findByNameAndBirthDate(@Param("userName") String userName,
                                  @Param("userBirthDate") Timestamp userBirthDate);

    // 비밀번호 찾기 (이메일 + 이름 + 생년월일)
    UserVO findForPasswordReset(@Param("userEmail") String userEmail,
                                @Param("userName") String userName,
                                @Param("userBirthDate") Timestamp userBirthDate);

    // 비밀번호 변경
    void updatePassword(@Param("userId") Long userId,
                        @Param("userPassword") String encodedPassword);

    // 마지막 로그인 시간 갱신
    void updateLastLoginDate(@Param("userId") Long userId);

    // FCM Token 업데이트
    void updateFcmToken(@Param("userId") Long userId,
                        @Param("fcmToken") String fcmToken,
                        @Param("deviceOs") String deviceOs,
                        @Param("deviceVersion") String deviceVersion);

    // userId로 회원 한 명 조회 (마이페이지용)
    UserVO selectById(@Param("userId") Long userId);

    ReviewedUserDetailDTO selectReviewedUserDetail(Long userId);
    
    // 여러 사용자의 FCM Token 조회 (알림 전송용)
    java.util.List<String> selectFcmTokensByUserIds(@Param("userIds") java.util.List<Long> userIds);
    
    // 같이 장보기에 대한 유저 평점 평균
    void updateRatingScoreByAvg(@Param("targetUserId") Long targetUserId);

    // 프로필 수정
    void updateUserProfile(
            @Param("userId") Long userId,
            @Param("userName") String userName,
            @Param("userNickname") String userNickname,
            @Param("userProfileImageUrl") String userProfileImageUrl,
            @Param("updatedId") Long updatedId,
            @Param("updatedDate") Timestamp updatedDate
    );

    // 회원 상태 변경(ACTIVE/SUSPENDED/WITHDRAW)
    void updateUserStatus(
            @Param("userId") Long userId,
            @Param("userStatus") String userStatus,
            @Param("updatedId") Long updatedId,
            @Param("updatedDate") Timestamp updatedDate
    );

    /**
     * 기간정지 만료 자동 복구
     * - user_status='SUSPENDED'
     * - suspended_until IS NOT NULL
     * - suspended_until <= SYSTIMESTAMP
     */
    int restoreExpiredSuspensionToActive(@Param("userId") Long userId);

    /**
     * 특정 사용자가 완료한 모임 수 실시간 조회
     * (tb_shopping_post.status_cd = 'DONE')
     */
    int countCompletedMeetings(@Param("userId") Long userId);

    /**
     * 특정 사용자가 참여한 전체 모임 수 실시간 조회
     * (나간 방 제외)
     */
    int countTotalMeetings(@Param("userId") Long userId);
}
