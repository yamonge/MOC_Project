package com.cucook.moc.user.dao; // ⭐ user 패키지 아래에 dao를 생성

import com.cucook.moc.user.dto.UserReviewDTO;
import com.cucook.moc.user.vo.UserReviewVO; // VO 임포트
import org.apache.ibatis.annotations.Mapper; // `@Mapper` 어노테이션
import org.apache.ibatis.annotations.Param; // 복수 파라미터 매핑을 위해 `@Param` 사용

import java.util.List;
import java.util.Map; // parameterType="map"을 위한 Map 임포트

@Mapper
public interface UserReviewDAO {

    /**
     * 특정 사용자가 '받은' 모든 후기 목록을 조회합니다.
     * `UserReviewMapper.xml`의 `<select id="selectReceivedUserReviewsByUserId">`와 매핑됩니다.
     * (마이페이지 '받은 후기 목록' 탭 표시용)
     *
     * @param targetUserId 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 해당 사용자가 받은 UserReviewVO 리스트
     */
    List<UserReviewVO> selectReceivedUserReviewsByUserId(Long targetUserId);

    /**
     * 특정 사용자가 '받은' 후기의 총 개수를 조회합니다.
     * `UserReviewMapper.xml`의 `<select id="countReceivedUserReviewsByUserId">`와 매핑됩니다.
     * (마이페이지 '받은 후기 목록' 카드에 표시용)
     *
     * @param targetUserId 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 받은 후기의 총 개수
     */
    int countReceivedUserReviewsByUserId(Long targetUserId);

    /**
     * 사용자 후기 정보를 데이터베이스에 저장합니다.
     * `UserReviewMapper.xml`의 `<insert id="insertUserReview">`와 매핑됩니다.
     * (같이 장보기 후, 다른 사용자에게 후기를 남길 때 사용)
     *
     * @param vo 저장할 UserReviewVO 객체
     * @return 삽입된 레코드 수
     */
    int insertUserReview(UserReviewVO vo);

    /**
     * 특정 장보기 게시글(shopping_post_id)에 대해 특정 작성자(writer_user_id)가
     * 특정 대상(target_user_id)에게 후기를 남겼는지 확인합니다.
     * `UserReviewMapper.xml`의 `<select id="checkIfUserReviewExists">`와 매핑됩니다.
     *
     * @param targetUserId 후기를 받은 사용자의 ID
     * @param writerUserId 후기를 남긴 사용자의 ID
     * @param shoppingPostId 후기가 작성된 장보기 게시글의 ID
     * @return 후기가 존재하면 1, 아니면 0
     */
    int checkIfUserReviewExists(
            @Param("targetUserId") Long targetUserId,
            @Param("writerUserId") Long writerUserId,
            @Param("shoppingPostId") Long shoppingPostId);

    /**
     * 특정 후기 ID로 단일 후기 정보를 조회합니다.
     * `UserReviewMapper.xml`의 `<select id="selectUserReviewById">`와 매핑됩니다.
     * (관리자/개발자용 또는 후기 수정/삭제 전 존재 여부 확인용)
     *
     * @param reviewId 조회할 후기 ID
     * @return 해당 후기의 UserReviewVO 객체 또는 null
     */
    UserReviewVO selectUserReviewById(Long reviewId);

    /**
     * 특정 후기 정보를 수정합니다.
     * `UserReviewMapper.xml`의 `<update id="updateUserReview">`와 매핑됩니다.
     * (관리자 또는 후기 작성자가 자신의 후기를 수정할 때 사용)
     *
     * @param vo 수정할 UserReviewVO 객체 (reviewId, writerUserId 포함)
     * @return 수정된 레코드 수
     */
    int updateUserReview(UserReviewVO vo);

    /**
     * 특정 후기 정보를 삭제합니다.
     * `UserReviewMapper.xml`의 `<delete id="deleteUserReview">`와 매핑됩니다.
     * (관리자 또는 후기 작성자가 자신의 후기를 삭제할 때 사용)
     *
     * @param userReviewId 삭제할 후기 ID
     * @param writerUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제된 레코드 수
     */
    int deleteUserReview(@Param("userReviewId") Long userReviewId, @Param("writerUserId") Long writerUserId);

    void insert(UserReviewVO vo);

    // 이미 작성된 리뷰가 있는지
    int countExisting(@Param("shoppingPostId") Long shoppingPostId,
                      @Param("writerUserId") Long writerUserId,
                      @Param("targetUserId") Long targetUserId);

    // 특정 유저(타겟)를 대상으로 한 리뷰 목록
    List<UserReviewDTO> selectReviewsForUser(@Param("targetUserId") Long targetUserId);
}
