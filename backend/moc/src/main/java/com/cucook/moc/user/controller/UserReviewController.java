package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.request.UserReviewRequestDTO;
import com.cucook.moc.user.dto.response.UserReviewListResponseDTO;
import com.cucook.moc.user.dto.response.UserReviewResponseDTO;
import com.cucook.moc.user.service.UserReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자 후기(같이 장보기 상대방에 대한 후기)에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '받은 후기 목록' 기능 및 후기 작성/수정/삭제 기능을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{writerUserId}/reviews")
@CrossOrigin(origins = "*", allowedHeaders = "*") // 개발용 CORS 설정 (모든 오리진 허용)
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
            @PathVariable("writerUserId") Long writerUserId,
            @RequestBody UserReviewRequestDTO requestDTO) {
        try {
            UserReviewResponseDTO response = userReviewService.addUserReview(writerUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            System.err.println("사용자 후기 추가 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (Exception e) {
            System.err.println("사용자 후기 추가 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
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
            @PathVariable("writerUserId") Long writerUserId) { // ⭐ 파라미터명 직관적으로 변경 (targetUserId)
        try {
            // Service 메서드의 파라미터는 targetUserId이므로, writerUserId를 targetUserId로 전달
            UserReviewListResponseDTO response = userReviewService.getReceivedUserReviews(writerUserId);
            if (response.getReceivedReviews().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("받은 사용자 후기 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("writerUserId") Long writerUserId, // ⭐ 요청자 ID (requestingUserId)로 사용
            @PathVariable("reviewId") Long reviewId) {
        try {
            UserReviewResponseDTO response = userReviewService.getUserReviewDetail(reviewId, writerUserId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("사용자 후기 상세 조회 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (후기 없음)
        } catch (Exception e) {
            System.err.println("사용자 후기 상세 조회 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("writerUserId") Long writerUserId,
            @PathVariable("reviewId") Long reviewId,
            @RequestBody UserReviewRequestDTO requestDTO) {
        try {
            UserReviewResponseDTO response = userReviewService.updateUserReview(reviewId, writerUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("사용자 후기 수정 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (후기 없음) 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("사용자 후기 수정 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("writerUserId") Long writerUserId,
            @PathVariable("reviewId") Long reviewId) {
        try {
            boolean deleted = userReviewService.deleteUserReview(reviewId, writerUserId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (삭제할 대상을 찾지 못함)
            }
        } catch (IllegalArgumentException e) {
            System.err.println("사용자 후기 삭제 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("사용자 후기 삭제 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("writerUserId") Long writerUserId) {
        try {
            // Service 메서드의 파라미터는 targetUserId이므로, writerUserId를 targetUserId로 전달
            int count = userReviewService.countReceivedUserReviews(writerUserId);
            return new ResponseEntity<>(count, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("받은 후기 개수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}