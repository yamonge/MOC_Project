package com.cucook.moc.recipe.controller; // ⭐ recipe 패키지 아래에 controller를 생성

import com.cucook.moc.recipe.dto.request.RecipeReportRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportResponseDTO;
import com.cucook.moc.recipe.service.RecipeReportService; // 서비스 주입
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List; // RecipeReportListResponseDTO 내부에서 List 사용

/**
 * 레시피 신고(tb_recipe_report) 기능에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '신고 내역' 중 레시피 신고 부분을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{reporterUserId}/recipe-reports")
public class RecipeReportController {

    private final RecipeReportService recipeReportService;

    @Autowired // 생성자 주입
    public RecipeReportController(RecipeReportService recipeReportService) {
        this.recipeReportService = recipeReportService;
    }

    /**
     * 레시피를 신고합니다.
     * POST /api/v1/users/{reporterUserId}/recipe-reports
     *
     * @param reporterUserId 경로 변수에서 가져온 신고하는 사용자의 ID
     * @param requestDTO 신고 정보를 담은 요청 DTO (recipeId, reportReasonCd, content 포함)
     * @return 작성된 신고 정보를 담은 응답 DTO와 HTTP 상태 코드 (201 Created)
     */
    @PostMapping
    public ResponseEntity<RecipeReportResponseDTO> addRecipeReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @RequestBody RecipeReportRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            RecipeReportResponseDTO response = recipeReportService.addRecipeReport(reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 사용자가 '신고한' 모든 레시피 신고 목록을 조회합니다.
     * 마이페이지 '신고 내역' 탭의 레시피 신고 목록 표시용입니다.
     * GET /api/v1/users/{reporterUserId}/recipe-reports
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 목록을 조회할 사용자의 ID
     * @return 사용자가 신고한 레시피 신고 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<RecipeReportListResponseDTO> getReportedRecipesByReporterUserId(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            RecipeReportListResponseDTO response = recipeReportService.getReportedRecipesByReporterUserId(reporterUserId);
            if (response.getReportedRecipes().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 레시피 신고 ID로 단일 신고 정보를 조회합니다.
     * GET /api/v1/users/{reporterUserId}/recipe-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @return 상세 레시피 신고 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<RecipeReportResponseDTO> getRecipeReportDetail(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            RecipeReportResponseDTO response = recipeReportService.getRecipeReportDetail(reportId, reporterUserId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 레시피 신고 정보를 수정합니다. (신고 내용/사유만 수정 가능하도록)
     * PUT /api/v1/users/{reporterUserId}/recipe-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @param requestDTO 수정할 신고 정보를 담은 요청 DTO (reportReasonCd, content 포함)
     * @return 수정된 신고 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @PutMapping("/{reportId}")
    public ResponseEntity<RecipeReportResponseDTO> updateRecipeReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            @RequestBody RecipeReportRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            RecipeReportResponseDTO response = recipeReportService.updateRecipeReport(reportId, reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 레시피 신고 기록을 삭제합니다.
     * DELETE /api/v1/users/{reporterUserId}/recipe-reports/{reportId}
     *
     * @param reporterUserId 경로 변수에서 가져온 신고 작성자의 ID (권한 확인용)
     * @param reportId 경로 변수에서 가져온 신고 ID
     * @return HTTP 상태 코드 (204 No Content 또는 404 Not Found)
     */
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteRecipeReport(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            @PathVariable("reportId") Long reportId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            boolean deleted = recipeReportService.deleteRecipeReport(reportId, reporterUserId);
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
     * 특정 사용자가 '신고한' 레시피 신고의 총 개수를 조회합니다.
     * 마이페이지 '신고 내역' 카드에 표시용입니다.
     * GET /api/v1/users/{reporterUserId}/recipe-reports/count
     *
     * @param reporterUserId 경로 변수에서 가져온 사용자 ID
     * @return 신고된 레시피 신고의 총 개수와 HTTP 상태 코드 (200 OK)
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countReportedRecipesByReporterUserId(
            @PathVariable("reporterUserId") Long ignoredReporterUserId,
            Authentication authentication) {
        try {
            Long reporterUserId = Long.parseLong(authentication.getName());
            int count = recipeReportService.countReportedRecipesByReporterUserId(reporterUserId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}