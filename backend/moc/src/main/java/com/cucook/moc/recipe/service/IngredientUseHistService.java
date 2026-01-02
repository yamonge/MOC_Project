package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.dto.response.IngredientUseHistListResponseDTO; // List Response DTO 사용
import com.cucook.moc.recipe.dto.response.IngredientUseHistResponseDTO; // Response DTO 사용
import com.cucook.moc.recipe.vo.IngredientUseHistVO; // VO 사용 (내부 로직용)

import java.util.List;

/**
 * 재료 사용 이력(tb_ingredient_use_hist)과 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 * 주로 레시피 시작 시 재료 소비 기록 및 관리자/개발자 이력 조회에 사용됩니다.
 */
public interface IngredientUseHistService {

    /**
     * 재료 사용 이력 정보를 저장합니다.
     * (워크플로우: 레시피 시작 시 재료 소비 처리 로직에서 호출)
     *
     * @param histVO 저장할 IngredientUseHistVO 객체
     * @return 저장된 이력 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락 등
     */
    IngredientUseHistResponseDTO addIngredientUseHist(IngredientUseHistVO histVO);

    /**
     * 특정 사용자의 모든 재료 사용 이력 목록을 조회합니다.
     * (개발자/관리자용 API 또는 내부 로깅 시스템에서 사용)
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    IngredientUseHistListResponseDTO getIngredientUseHistsByUserId(Long userId);

    /**
     * 특정 사용자 재료(`tb_user_ingredient`)에 대한 사용 이력 목록을 조회합니다.
     * (개발자/관리자용 API 또는 특정 재료 소비 이력 추적용)
     *
     * @param userIngredientId 조회할 사용자 재료의 ID
     * @return 해당 사용자 재료의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    IngredientUseHistListResponseDTO getIngredientUseHistsByUserIngredientId(Long userIngredientId);

    /**
     * 특정 사용자가 특정 레시피에서 사용한 재료 이력을 조회합니다.
     * (개발자/관리자용 API 또는 레시피별 재료 소비 통계용)
     *
     * @param userId 조회할 사용자의 ID
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피와 사용자 조합의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    IngredientUseHistListResponseDTO getIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId);

    /**
     * 특정 사용자가 기록한 모든 재료 사용 이력의 총 개수를 조회합니다.
     * (개발자/관리자용 통계)
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 재료 사용 이력의 총 개수
     */
    int countIngredientUseHistsByUserId(Long userId);

    /**
     * 특정 재료 사용 이력 기록을 삭제합니다.
     * (개발자/관리자용 API 또는 시스템 유지보수용)
     *
     * @param ingredientUseHistId 삭제할 이력의 ID
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 이력을 찾을 수 없을 경우
     */
    boolean deleteIngredientUseHist(Long ingredientUseHistId);

    /**
     * 특정 레시피와 관련된 사용자의 모든 재료 이력을 삭제합니다.
     * (개발자/관리자용 API 또는 레시피 삭제 시 연동 삭제용)
     *
     * @param userId 삭제할 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제된 레코드 수
     */
    int deleteIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId);

    /**
     * 특정 재료 사용 이력 ID로 단일 이력 정보를 조회합니다.
     * (삭제 전 존재 여부 확인용 또는 관리자 상세 조회용)
     *
     * @param ingredientUseHistId 조회할 이력의 ID
     * @return 상세 이력 정보를 담은 응답 DTO 또는 null (해당 이력이 없을 경우)
     */
    IngredientUseHistResponseDTO getIngredientUseHistById(Long ingredientUseHistId);
}