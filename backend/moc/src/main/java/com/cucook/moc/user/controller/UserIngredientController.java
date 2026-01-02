package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.request.IngredientConsumeRequestDTO;
import com.cucook.moc.user.dto.request.UserIngredientRequestDTO;
import com.cucook.moc.user.dto.response.UserIngredientListResponseDTO;
import com.cucook.moc.user.dto.response.UserIngredientResponseDTO;
import com.cucook.moc.user.service.UserIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 재료 정보(인벤토리)에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '재료 관리' 기능을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{userId}/ingredients")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserIngredientController {

    private final UserIngredientService userIngredientService;

    @Autowired // 생성자 주입
    public UserIngredientController(UserIngredientService userIngredientService) {
        this.userIngredientService = userIngredientService;
    }

    /**
     * 특정 사용자의 새로운 재료를 추가합니다.
     * POST /api/v1/users/{userId}/ingredients
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param requestDTO 추가할 재료 정보를 담은 요청 DTO
     * @return 추가된 재료 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @PostMapping
    public ResponseEntity<UserIngredientResponseDTO> addUserIngredient(
            @PathVariable("userId") Long userId,
            @RequestBody UserIngredientRequestDTO requestDTO) {
        System.out.println("🔥 addUserIngredient userId=" + userId);
        System.out.println("🔥 requestDTO=" + requestDTO);
        try {
            UserIngredientResponseDTO response = userIngredientService.addUserIngredient(userId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            // 입력 데이터 유효성 검사 실패 등 클라이언트 요청 오류
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (Exception e) {
            // 기타 예상치 못한 서버 오류
            System.err.println("재료 추가 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자의 모든 재료 목록을 조회합니다.
     * GET /api/v1/users/{userId}/ingredients
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @return 사용자 재료 목록과 총 개수를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<UserIngredientListResponseDTO> getUserIngredients(
            @PathVariable Long userId) {

        UserIngredientListResponseDTO response =
                userIngredientService.getUserIngredients(userId);

        // ✅ 재료가 없어도 정상 응답
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 사용자의 단일 재료 상세 정보를 조회합니다.
     * GET /api/v1/users/{userId}/ingredients/{userIngredientId}
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param userIngredientId 경로 변수에서 가져온 재료 ID
     * @return 상세 재료 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @GetMapping("/{userIngredientId}")
    public ResponseEntity<UserIngredientResponseDTO> getUserIngredientDetail(
            @PathVariable("userId") Long userId,
            @PathVariable("userIngredientId") Long userIngredientId) {
        try {
            UserIngredientResponseDTO response = userIngredientService.getUserIngredientDetail(userId, userIngredientId);
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
        } catch (IllegalArgumentException e) {
            // 재료를 찾을 수 없거나 권한이 없을 경우
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403 Forbidden (권한 문제) 또는 404 Not Found (자원 없음)
        } catch (Exception e) {
            System.err.println("재료 상세 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자의 재료 정보를 수정합니다.
     * PUT /api/v1/users/{userId}/ingredients/{userIngredientId}
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param userIngredientId 경로 변수에서 가져온 재료 ID
     * @param requestDTO 수정할 재료 정보를 담은 요청 DTO
     * @return 수정된 재료 정보를 담은 응답 DTO와 HTTP 상태 코드
     */
    @PutMapping("/{userIngredientId}")
    public ResponseEntity<UserIngredientResponseDTO> updateUserIngredient(
            @PathVariable("userId") Long userId,
            @PathVariable("userIngredientId") Long userIngredientId,
            @RequestBody UserIngredientRequestDTO requestDTO) {
        try {
            UserIngredientResponseDTO response = userIngredientService.updateUserIngredient(userId, userIngredientId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
        } catch (IllegalArgumentException e) {
            // 재료를 찾을 수 없거나 권한이 없거나 입력 데이터 유효성 문제
            System.err.println("재료 수정 중 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request 또는 403 Forbidden
        } catch (Exception e) {
            System.err.println("재료 수정 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자의 재료를 삭제합니다.
     * DELETE /api/v1/users/{userId}/ingredients/{userIngredientId}
     *
     * @param userId 경로 변수에서 가져온 사용자 ID (권한 확인용)
     * @param userIngredientId 경로 변수에서 가져온 재료 ID
     * @return HTTP 상태 코드 (204 No Content 또는 403 Forbidden)
     */
    @DeleteMapping("/{userIngredientId}")
    public ResponseEntity<Void> deleteUserIngredient(
            @PathVariable("userId") Long userId,
            @PathVariable("userIngredientId") Long userIngredientId) {
        try {
            boolean deleted = userIngredientService.deleteUserIngredient(userId, userIngredientId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found (삭제할 대상을 찾지 못함)
            }
        } catch (IllegalArgumentException e) {
            // 재료를 찾을 수 없거나 권한이 없을 경우
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403 Forbidden
        } catch (Exception e) {
            System.err.println("재료 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    /**
     * 특정 사용자가 보유한 재료의 총 개수를 조회합니다.
     * GET /api/v1/users/{userId}/ingredients/count
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @return 보유 재료의 총 개수와 HTTP 상태 코드
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> countUserIngredients(
            @PathVariable("userId") Long userId) {
        try {
            int count = userIngredientService.countUserIngredients(userId);
            return new ResponseEntity<>(count, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            System.err.println("재료 개수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * 영수증 인식 결과로 얻은 재료명 리스트를 사용자의 '내 재료'로 일괄 추가합니다.
     * POST /api/v1/users/{userId}/ingredients/from-receipt
     *
     * @param userId 경로 변수에서 가져온 사용자 ID
     * @param ingredientNames 영수증에서 인식된 재료명 리스트 (RequestBody)
     * @return 추가된 '내 재료' 정보를 담은 응답 DTO 리스트
     */
    @PostMapping("/from-receipt")
    public ResponseEntity<List<UserIngredientResponseDTO>> addIngredientsFromReceipt(
            @PathVariable("userId") Long userId,
            @RequestBody List<String> ingredientNames) {
        try {
            // createdId는 userId와 동일하게 설정
            List<UserIngredientResponseDTO> responses = userIngredientService.addIngredientsFromRecognizedReceipt(userId, ingredientNames, userId);
            if (responses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(responses, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("영수증 인식 재료를 내 재료로 추가 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/consume")
    public ResponseEntity<Void> consumeIngredients(
            @PathVariable("userId") Long userId,
            @RequestBody IngredientConsumeRequestDTO requestDTO
    ) {
        try {
            userIngredientService.consumeIngredients(userId, requestDTO);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}