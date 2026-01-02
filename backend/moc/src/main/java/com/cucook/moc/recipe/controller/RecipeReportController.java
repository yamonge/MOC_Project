package com.cucook.moc.recipe.controller; // ⭐ recipe 패키지 아래에 controller를 생성

import com.cucook.moc.recipe.dto.request.RecipeReportRequestDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportResponseDTO;
import com.cucook.moc.recipe.service.RecipeReportService; // 서비스 주입
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // RecipeReportListResponseDTO 내부에서 List 사용

/**
 * 레시피 신고(tb_recipe_report) 기능에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '신고 내역' 중 레시피 신고 부분을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{reporterUserId}/recipe-reports")
@CrossOrigin(origins = "*", allowedHeaders = "*") // 개발용 CORS 설정 (모든 오리진 허용)
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
            @PathVariable("reporterUserId") Long reporterUserId,
            @RequestBody RecipeReportRequestDTO requestDTO) {
        try {
            RecipeReportResponseDTO response = recipeReportService.addRecipeReport(reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            System.err.println("레시피 신고 추가 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request (존재하지 않는 레시피 ID, 중복 신고 등)
        } catch (Exception e) {
            System.err.println("레시피 신고 추가 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
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
            @PathVariable("reporterUserId") Long reporterUserId) {
        try {
            RecipeReportListResponseDTO response = recipeReportService.getReportedRecipesByReporterUserId(reporterUserId);
            if (response.getReportedRecipes().isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT); // 204 No Content
            }
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("신고된 레시피 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
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
            @PathVariable("reporterUserId") Long reporterUserId, // ⭐ 요청자 ID (requestingUserId)로 사용
            @PathVariable("reportId") Long reportId) {
        try {
            RecipeReportResponseDTO response = recipeReportService.getRecipeReportDetail(reportId, reporterUserId); // ⭐ requestingUserId로 reporterUserId 전달
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("레시피 신고 상세 조회 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (신고 없음) 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("레시피 신고 상세 조회 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("reporterUserId") Long reporterUserId,
            @PathVariable("reportId") Long reportId,
            @RequestBody RecipeReportRequestDTO requestDTO) {
        try {
            RecipeReportResponseDTO response = recipeReportService.updateRecipeReport(reportId, reporterUserId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("레시피 신고 수정 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (신고 없음) 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("레시피 신고 수정 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("reporterUserId") Long reporterUserId,
            @PathVariable("reportId") Long reportId) {
        try {
            boolean deleted = recipeReportService.deleteRecipeReport(reportId, reporterUserId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (삭제할 대상을 찾지 못함)
            }
        } catch (IllegalArgumentException e) {
            System.err.println("레시피 신고 삭제 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("레시피 신고 삭제 중 예상치 못한 오류 발생: " + e.getMessage());
            e.printStackTrace();
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
            @PathVariable("reporterUserId") Long reporterUserId) {
        try {
            int count = recipeReportService.countReportedRecipesByReporterUserId(reporterUserId);
            return new ResponseEntity<>(count, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("신고된 레시피 개수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}