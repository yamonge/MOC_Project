package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.request.UserReportRequestDTO;
import com.cucook.moc.user.dto.response.UserReportListResponseDTO;
import com.cucook.moc.user.dto.response.UserReportResponseDTO;
import com.cucook.moc.user.service.UserReportService; // 서비스 주입
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자 신고(tb_user_report) 기능에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '신고 내역' 중 사용자 신고 부분을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{reporterUserId}/user-reports")
public class UserReportController {

    private final UserReportService userReportService;

    @Autowired // 생성자 주입
    public UserReportController(UserReportService userReportService) {
        this.userReportService = userReportService;
    }

    /**
     * 다른 사용자를 신고합니다.
     * POST /api/v1/users/{reporterUserId}/user-reports
     *
     * @param reporterUserId 경로 변수에서 가져온 신고하는 사용자의 ID
     * @param requestDTO 신고 정보를 담은 요청 DTO (reportedUserId, reportReasonCd, reportComment 포함)
     * @return 작성된 신고 정보를 담은 응답 DTO와 HTTP 상태 코드 (201 Created)
     */
    @PostMapping
    public ResponseEntity<UserReportResponseDTO> addUserReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @RequestBody UserReportRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            UserReportResponseDTO response = userReportService.addUserReport(reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 '신고한' 모든 사용자 신고 목록을 조회합니다.
     * 마이페이지 '신고 내역' 탭의 사용자 신고 목록 표시용입니다.
     * GET /api/v1/users/{reporterUserId}/user-reports
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 목록을 조회할 사용자의 ID
     * @return 사용자가 신고한 사용자 신고 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<UserReportListResponseDTO> getReportedUsersByReporterUserId(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            UserReportListResponseDTO response = userReportService.getReportedUsersByReporterUserId(reporterUserId);
            if (response.getReportedUsers().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자 신고 ID로 단일 신고 정보를 조회합니다.
     * GET /api/v1/users/{reporterUserId}/user-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @return 상세 사용자 신고 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<UserReportResponseDTO> getUserReportDetail(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            UserReportResponseDTO response = userReportService.getUserReportDetail(reportId, reporterUserId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자 신고 정보를 수정합니다. (신고 내용/사유만 수정 가능하도록)
     * PUT /api/v1/users/{reporterUserId}/user-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @param requestDTO 수정할 신고 정보를 담은 요청 DTO (reportReasonCd, reportComment 포함)
     * @return 수정된 신고 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @PutMapping("/{reportId}")
    public ResponseEntity<UserReportResponseDTO> updateUserReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            @RequestBody UserReportRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            UserReportResponseDTO response = userReportService.updateUserReport(reportId, reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자 신고 기록을 삭제합니다.
     * DELETE /api/v1/users/{reporterUserId}/user-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @return HTTP 상태 코드 (204 No Content 또는 404 Not Found)
     */
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteUserReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            boolean deleted = userReportService.deleteUserReport(reportId, reporterUserId);
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
     * 특정 사용자가 '신고한' 사용자 신고의 총 개수를 조회합니다.
     * 마이페이지 '신고 내역' 카드에 표시용입니다.
     * GET /api/v1/users/{reporterUserId}/user-reports/count
     *
     * @param reporterUserId 경로 변수에서 가져온 사용자 ID
     * @return 신고된 사용자 신고의 총 개수와 HTTP 상태 코드
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countReportedUsersByReporterUserId(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            int count = userReportService.countReportedUsersByReporterUserId(reporterUserId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}