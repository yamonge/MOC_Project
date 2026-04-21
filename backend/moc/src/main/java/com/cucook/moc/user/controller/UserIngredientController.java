package com.cucook.moc.user.controller;

import com.cucook.moc.user.dto.request.IngredientConsumeRequestDTO;
import com.cucook.moc.user.dto.request.UserIngredientRequestDTO;
import com.cucook.moc.user.dto.response.UserIngredientListResponseDTO;
import com.cucook.moc.user.dto.response.UserIngredientResponseDTO;
import com.cucook.moc.user.service.UserIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 재료 정보(인벤토리)에 대한 REST API를 처리하는 컨트롤러입니다.
 * 마이페이지의 '재료 관리' 기능을 담당합니다.
 */
@RestController
@RequestMapping("/api/v1/users/{userId}/ingredients")
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
            @PathVariable("userId") Long ignoredUserId,
            @RequestBody UserIngredientRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            UserIngredientResponseDTO response = userIngredientService.addUserIngredient(userId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
            @PathVariable Long userId,
            Authentication authentication) {
        Long authUserId = Long.parseLong(authentication.getName());
        UserIngredientListResponseDTO response =
                userIngredientService.getUserIngredients(authUserId);
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
            @PathVariable("userId") Long ignoredUserId,
            @PathVariable("userIngredientId") Long userIngredientId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            UserIngredientResponseDTO response = userIngredientService.getUserIngredientDetail(userId, userIngredientId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
            @PathVariable("userId") Long ignoredUserId,
            @PathVariable("userIngredientId") Long userIngredientId,
            @RequestBody UserIngredientRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            UserIngredientResponseDTO response = userIngredientService.updateUserIngredient(userId, userIngredientId, requestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
            @PathVariable("userId") Long ignoredUserId,
            @PathVariable("userIngredientId") Long userIngredientId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            boolean deleted = userIngredientService.deleteUserIngredient(userId, userIngredientId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
            @PathVariable("userId") Long ignoredUserId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            int count = userIngredientService.countUserIngredients(userId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
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
            @PathVariable("userId") Long ignoredUserId,
            @RequestBody List<String> ingredientNames,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            List<UserIngredientResponseDTO> responses = userIngredientService.addIngredientsFromRecognizedReceipt(userId, ingredientNames, userId);
            if (responses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(responses, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/consume")
    public ResponseEntity<Void> consumeIngredients(
            @PathVariable("userId") Long ignoredUserId,
            @RequestBody IngredientConsumeRequestDTO requestDTO,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            userIngredientService.consumeIngredients(userId, requestDTO);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}