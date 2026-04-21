package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.request.UserReviewRequestDTO;
import com.cucook.moc.user.dto.response.UserReviewListResponseDTO;
import com.cucook.moc.user.dto.response.UserReviewResponseDTO;
import com.cucook.moc.user.service.UserReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자 후기(같이 장보기 상대방에 대한 후기)에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '받은 후기 목록' 기능 및 후기 작성/수정/삭제 기능을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{writerUserId}/reviews")
public class UserReviewController {

    private final UserReviewService userReviewService;

    @Autowired // 생성자 주입
    public UserReviewController(UserReviewService userReviewService) {
        this.userReviewService = userReviewService;
    }

    /**
     * 특정 사용자에게 후기를 남깁니다. (같이 장보기 후)
     * POST /api/v1/users/{writerUserId}/reviews
     *
     * @param writerUserId 경로 변수에서 가져온 후기를 남기는 사용자의 ID
     * @param requestDTO 후기 정보를 담은 요청 DTO (targetUserId, shoppingPostId, rating, comment 포함)
     * @return 작성된 후기 정보를 담은 응답 DTO와 HTTP 상태 코드 (201 Created)
     */
    @PostMapping
    public ResponseEntity<UserReviewResponseDTO> addUserReview(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            @RequestBody UserReviewRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long writerUserId = Long.parseLong(authentication.getName());
            UserReviewResponseDTO response = userReviewService.addUserReview(writerUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 '받은' 모든 후기 목록을 조회합니다.
     * 마이페이지 '받은 후기 목록' 탭의 목록 표시용입니다.
     * GET /api/v1/users/{writerUserId}/reviews/received
     * (이때 {writerUserId}는 마이페이지 주인의 ID, 즉 targetUserId가 됩니다.)
     *
     * @param writerUserId 경로 변수에서 가져온 사용자 ID (실질적으로는 후기를 받은 사람의 ID)
     * @return 사용자가 받은 후기 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/received")
    public ResponseEntity<UserReviewListResponseDTO> getReceivedUserReviews(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            UserReviewListResponseDTO response = userReviewService.getReceivedUserReviews(userId);
            if (response.getReceivedReviews().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 후기 ID로 단일 후기 정보를 조회합니다.
     * GET /api/v1/users/{writerUserId}/reviews/{reviewId}
     *
     * @param writerUserId 경로 변수에서 가져온 후기 작성자의 ID (권한 확인용)
     * @param reviewId 경로 변수에서 가져온 후기 ID
     * @return 상세 후기 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<UserReviewResponseDTO> getUserReviewDetail(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            @PathVariable("reviewId") Long reviewId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            UserReviewResponseDTO response = userReviewService.getUserReviewDetail(reviewId, userId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 후기 정보를 수정합니다.
     * PUT /api/v1/users/{writerUserId}/reviews/{reviewId}
     *
     * @param writerUserId 경로 변수에서 가져온 후기 작성자의 ID (권한 확인용)
     * @param reviewId 경로 변수에서 가져온 후기 ID
     * @param requestDTO 수정할 후기 정보를 담은 요청 DTO
     * @return 수정된 후기 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<UserReviewResponseDTO> updateUserReview(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            @PathVariable("reviewId") Long reviewId,
            @RequestBody UserReviewRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long writerUserId = Long.parseLong(authentication.getName());
            UserReviewResponseDTO response = userReviewService.updateUserReview(reviewId, writerUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 후기 정보를 삭제합니다.
     * DELETE /api/v1/users/{writerUserId}/reviews/{reviewId}
     *
     * @param writerUserId 경로 변수에서 가져온 후기 작성자의 ID (권한 확인용)
     * @param reviewId 경로 변수에서 가져온 후기 ID
     * @return HTTP 상태 코드 (204 No Content 또는 404 Not Found)
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteUserReview(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            @PathVariable("reviewId") Long reviewId,
            Authentication authentication) {
        try {
            Long writerUserId = Long.parseLong(authentication.getName());
            boolean deleted = userReviewService.deleteUserReview(reviewId, writerUserId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 '받은' 후기의 총 개수를 조회합니다.
     * GET /api/v1/users/{targetUserId}/reviews/count
     * (마이페이지 '받은 후기 목록' 카드에 표시용)
     *
     * @param writerUserId 경로 변수에서 가져온 사용자 ID (실질적으로는 후기를 받은 사람의 ID)
     * @return 받은 후기의 총 개수와 HTTP 상태 코드
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countReceivedUserReviews(
            @PathVariable("writerUserId") Long ignoredWriterUserId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            int count = userReviewService.countReceivedUserReviews(userId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}