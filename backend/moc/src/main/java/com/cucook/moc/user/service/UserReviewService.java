package com.cucook.moc.user.service; // ⭐ user 패키지

import com.cucook.moc.user.dto.request.UserReviewRequestDTO; // Request DTO 사용
import com.cucook.moc.user.dto.response.UserReviewListResponseDTO; // List Response DTO 사용
import com.cucook.moc.user.dto.response.UserReviewResponseDTO; // Response DTO 사용

import java.util.List; // UserReviewListResponseDTO 내부에서 List 사용

/**
 * 사용자 후기(tb_user_review, 같이 장보기 상대방에 대한 후기)와 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 * 마이페이지의 '받은 후기 목록' 기능 및 후기 작성 기능을 담당합니다.
 */
public interface UserReviewService {

    /**
     * 특정 사용자에게 후기를 남깁니다. (같이 장보기 후)
     *
     * @param writerUserId 후기를 남기는 사용자의 ID
     * @param requestDTO 후기 정보를 담은 요청 DTO (targetUserId, shoppingPostId, rating, comment 포함)
     * @return 작성된 후기 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락, 이미 후기를 남긴 경우 등
     */
    UserReviewResponseDTO addUserReview(Long writerUserId, UserReviewRequestDTO requestDTO);

    /**
     * 특정 사용자가 '받은' 모든 후기 목록을 조회합니다.
     * 마이페이지의 '받은 후기 목록' 탭의 목록 표시용입니다.
     *
     * @param targetUserId 후기 목록을 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 사용자가 받은 후기 목록과 총 개수를 담은 응답 DTO
     */
    UserReviewListResponseDTO getReceivedUserReviews(Long targetUserId);

    /**
     * 특정 후기 ID로 단일 후기 정보를 조회합니다.
     * (관리자/개발자용 또는 후기 수정/삭제 전 존재 여부 확인용)
     *
     * @param reviewId 조회할 후기 ID
     * @param requestingUserId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @return 상세 후기 정보를 담은 응답 DTO 또는 null (해당 후기가 없을 경우)
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    UserReviewResponseDTO getUserReviewDetail(Long reviewId, Long requestingUserId);

    /**
     * 특정 후기 정보를 수정합니다.
     * (관리자 또는 후기 작성자가 자신의 후기를 수정할 때 사용)
     *
     * @param reviewId 수정할 후기 ID
     * @param writerUserId 후기 작성자의 ID (권한 확인용)
     * @param requestDTO 수정할 후기 정보를 담은 요청 DTO
     * @return 수정된 후기 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    UserReviewResponseDTO updateUserReview(Long reviewId, Long writerUserId, UserReviewRequestDTO requestDTO);

    /**
     * 특정 후기 정보를 삭제합니다.
     * (관리자 또는 후기 작성자가 자신의 후기를 삭제할 때 사용)
     *
     * @param reviewId 삭제할 후기 ID
     * @param writerUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    boolean deleteUserReview(Long reviewId, Long writerUserId);

    /**
     * 특정 사용자가 '받은' 후기의 총 개수를 조회합니다.
     * 마이페이지 '받은 후기 목록' 카드에 표시용입니다.
     *
     * @param targetUserId 개수를 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 받은 후기의 총 개수
     */
    int countReceivedUserReviews(Long targetUserId);
}