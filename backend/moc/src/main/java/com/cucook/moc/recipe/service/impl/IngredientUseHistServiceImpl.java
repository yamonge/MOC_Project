package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.IngredientUseHistDAO; // DAO 주입
import com.cucook.moc.recipe.dto.response.IngredientUseHistListResponseDTO;
import com.cucook.moc.recipe.dto.response.IngredientUseHistResponseDTO;
import com.cucook.moc.recipe.service.IngredientUseHistService; // 인터페이스 구현
import com.cucook.moc.recipe.vo.IngredientUseHistVO; // VO 사용
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service // Spring 서비스 컴포넌트로 등록
public class IngredientUseHistServiceImpl implements IngredientUseHistService {

    private final IngredientUseHistDAO ingredientUseHistDAO;

    @Autowired // 생성자 주입
    public IngredientUseHistServiceImpl(IngredientUseHistDAO ingredientUseHistDAO) {
        this.ingredientUseHistDAO = ingredientUseHistDAO;
    }
    /**
     * 재료 사용 이력 정보를 저장합니다.
     * (워크플로우: 레시피 시작 시 재료 소비 처리 로직에서 호출)
     *
     * @param histVO 저장할 IngredientUseHistVO 객체
     * @return 저장된 이력 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락 등
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public IngredientUseHistResponseDTO addIngredientUseHist(IngredientUseHistVO histVO) {
        // 필수 필드 유효성 검사 (예: userId, userIngredientId)
        if (histVO.getUserId() == null || histVO.getUserIngredientId() == null) {
            throw new IllegalArgumentException("사용자 ID와 사용자 재료 ID는 필수입니다.");
        }
        // createdId가 null이면 userId로 설정 (보통 사용자가 직접 사용하므로)
        if (histVO.getCreatedId() == null) {
            histVO.setCreatedId(histVO.getUserId());
        }

        int insertedCount = ingredientUseHistDAO.insertIngredientUseHist(histVO);
        if (insertedCount == 0 || histVO.getIngredientUseHistId() == null) {
            throw new RuntimeException("재료 사용 이력 저장에 실패했습니다.");
        }

        return IngredientUseHistResponseDTO.from(histVO); // 편의 메서드 사용
    }

    /**
     * 특정 재료 사용 이력 ID로 단일 이력 정보를 조회합니다.
     * (삭제 전 존재 여부 확인용 또는 관리자 상세 조회용)
     *
     * @param ingredientUseHistId 조회할 이력의 ID
     * @return 상세 이력 정보를 담은 응답 DTO 또는 null (해당 이력이 없을 경우)
     */
    @Override // ⭐ 인터페이스 구현 명시
    @Transactional(readOnly = true)
    public IngredientUseHistResponseDTO getIngredientUseHistById(Long ingredientUseHistId) {
        IngredientUseHistVO vo = ingredientUseHistDAO.selectIngredientUseHistById(ingredientUseHistId);
        return vo != null ? IngredientUseHistResponseDTO.from(vo) : null;
    }

    /**
     * 특정 사용자의 모든 재료 사용 이력 목록을 조회합니다.
     * (개발자/관리자용 API 또는 내부 로깅 시스템에서 사용)
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public IngredientUseHistListResponseDTO getIngredientUseHistsByUserId(Long userId) {
        List<IngredientUseHistVO> voList = ingredientUseHistDAO.selectIngredientUseHistsByUserId(userId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자 재료(`tb_user_ingredient`)에 대한 사용 이력 목록을 조회합니다.
     * (개발자/관리자용 API 또는 특정 재료 소비 이력 추적용)
     *
     * @param userIngredientId 조회할 사용자 재료의 ID
     * @return 해당 사용자 재료의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistListResponseDTO getIngredientUseHistsByUserIngredientId(Long userIngredientId) {
        List<IngredientUseHistVO> voList = ingredientUseHistDAO.selectIngredientUseHistsByUserIngredientId(userIngredientId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자가 특정 레시피에서 사용한 재료 이력을 조회합니다.
     * (개발자/관리자용 API 또는 레시피별 재료 소비 통계용)
     *
     * @param userId 조회할 사용자의 ID
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피와 사용자 조합의 재료 사용 이력 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistListResponseDTO getIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId) {
        List<IngredientUseHistVO> voList = ingredientUseHistDAO.selectIngredientUseHistsByRecipeAndUser(userId, recipeId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자가 기록한 모든 재료 사용 이력의 총 개수를 조회합니다.
     * (개발자/관리자용 통계)
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 재료 사용 이력의 총 개수
     */
    @Override
    @Transactional(readOnly = true)
    public int countIngredientUseHistsByUserId(Long userId) {
        return ingredientUseHistDAO.countIngredientUseHistsByUserId(userId);
    }

    /**
     * 특정 재료 사용 이력 기록을 삭제합니다.
     * (개발자/관리자용 API 또는 시스템 유지보수용)
     *
     * @param ingredientUseHistId 삭제할 이력의 ID
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 이력을 찾을 수 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public boolean deleteIngredientUseHist(Long ingredientUseHistId) {
        IngredientUseHistVO existingVo = ingredientUseHistDAO.selectIngredientUseHistById(ingredientUseHistId);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 재료 사용 이력 (ID: " + ingredientUseHistId + ")을 찾을 수 없습니다.");
        }
        int deletedCount = ingredientUseHistDAO.deleteIngredientUseHist(ingredientUseHistId);
        return deletedCount > 0;
    }

    /**
     * 특정 레시피와 관련된 사용자의 모든 재료 이력을 삭제합니다.
     * (개발자/관리자용 API 또는 레시피 삭제 시 연동 삭제용)
     *
     * @param userId 삭제할 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제된 레코드 수
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public int deleteIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId) {
        // 삭제 전 해당 이력들이 존재하는지 확인하는 로직 추가 가능 (선택 사항)
        return ingredientUseHistDAO.deleteIngredientUseHistsByRecipeAndUser(userId, recipeId);
    }



}