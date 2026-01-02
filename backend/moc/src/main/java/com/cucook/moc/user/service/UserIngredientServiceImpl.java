package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserIngredientDAO; // DAO 주입
import com.cucook.moc.user.dto.request.IngredientConsumeRequestDTO;
import com.cucook.moc.user.dto.request.UserIngredientRequestDTO; // Request DTO 사용
import com.cucook.moc.user.dto.response.UserIngredientListResponseDTO; // List Response DTO 사용
import com.cucook.moc.user.dto.response.UserIngredientResponseDTO; // Response DTO 사용
import com.cucook.moc.user.service.UserIngredientService; // 인터페이스 구현
import com.cucook.moc.user.vo.UserIngredientVO; // VO 사용
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Spring 서비스 컴포넌트로 등록
public class UserIngredientServiceImpl implements UserIngredientService {

    private final UserIngredientDAO userIngredientDAO;

    @Autowired // 생성자 주입
    public UserIngredientServiceImpl(UserIngredientDAO userIngredientDAO) {
        this.userIngredientDAO = userIngredientDAO;
    }

    /**
     * 새로운 사용자 재료를 추가합니다.
     * @param userId 요청을 수행하는 사용자의 ID
     * @param requestDTO 추가할 재료 정보를 담은 요청 DTO
     * @return 추가된 재료 정보를 담은 응답 DTO
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserIngredientResponseDTO addUserIngredient(Long userId, UserIngredientRequestDTO requestDTO) {
        // ✅ 1. 중복 체크: 같은 사용자의 같은 재료명이 이미 있는지 확인
        String ingredientName = requestDTO.getIngredientName();
        UserIngredientVO existingIngredient = userIngredientDAO.selectByUserIdAndIngredientName(userId, ingredientName);

        if (existingIngredient != null) {
            // 이미 존재하는 재료인 경우: 기존 데이터를 그대로 반환
            System.out.println("⚠️ 중복 재료 감지: userId=" + userId + ", ingredientName=" + ingredientName);
            return UserIngredientResponseDTO.from(existingIngredient);
        }

        // 2. Request DTO -> VO 변환
        UserIngredientVO vo = new UserIngredientVO();
        vo.setUserId(userId); // 현재 로그인한 사용자 ID 설정
        vo.setIngredientName(requestDTO.getIngredientName());
        vo.setQuantityDesc(
                Optional.ofNullable(requestDTO.getQuantityDesc())
                        .filter(v -> !v.isBlank())
                        .orElse("1개")
        );
        vo.setCategoryCd(requestDTO.getCategoryCd());
        vo.setUsedFlag(requestDTO.getUsedFlag() != null ? requestDTO.getUsedFlag() : "N"); // 기본값 'N'
        vo.setMemo(
                Optional.ofNullable(requestDTO.getMemo())
                        .orElse("")
        );
        vo.setCreatedId(userId); // 생성자 ID 설정

        // 3. DB에 저장
        int insertedCount = userIngredientDAO.insertUserIngredient(vo);
        if (insertedCount == 0 || vo.getUserIngredientId() == null) {
            throw new RuntimeException("재료 추가에 실패했습니다.");
        }

        // 4. 저장된 VO를 기반으로 Response DTO 생성 및 반환
        return UserIngredientResponseDTO.from(vo); // 편의 메서드 사용
    }

    /**
     * 특정 사용자의 모든 재료 목록을 조회합니다.
     * @param userId 재료를 조회할 사용자의 ID
     * @return 사용자 재료 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public UserIngredientListResponseDTO getUserIngredients(Long userId) {
        List<UserIngredientVO> voList = userIngredientDAO.selectUserIngredientsByUserId(userId);

        // VO 리스트 -> DTO 리스트 변환 (편의 메서드 활용)
        List<UserIngredientResponseDTO> dtoList = voList.stream()
                .map(UserIngredientResponseDTO::from)
                .collect(Collectors.toList());

        return new UserIngredientListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자 재료의 상세 정보를 조회합니다.
     * @param userId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @param userIngredientId 조회할 특정 재료의 ID
     * @return 상세 재료 정보를 담은 응답 DTO 또는 null (해당 재료가 없을 경우)
     * @throws IllegalArgumentException 해당 재료가 없거나 권한이 없을 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserIngredientResponseDTO getUserIngredientDetail(Long userId, Long userIngredientId) {
        UserIngredientVO vo = userIngredientDAO.selectUserIngredientById(userIngredientId);

        // 재료 존재 여부 및 권한 확인
        if (vo == null) {
            throw new IllegalArgumentException("해당 재료를 찾을 수 없습니다.");
        }
        if (!vo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 조회 권한이 없습니다.");
        }

        return UserIngredientResponseDTO.from(vo);
    }

    /**
     * 기존 사용자 재료 정보를 수정합니다.
     * @param userId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @param userIngredientId 수정할 특정 재료의 ID
     * @param requestDTO 수정할 재료 정보를 담은 요청 DTO
     * @return 수정된 재료 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 재료가 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserIngredientResponseDTO updateUserIngredient(Long userId, Long userIngredientId, UserIngredientRequestDTO requestDTO) {
        // 1. 기존 재료 정보 조회 (권한 확인 포함)
        UserIngredientVO existingVo = userIngredientDAO.selectUserIngredientById(userIngredientId);
        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 재료를 찾을 수 없습니다.");
        }
        if (!existingVo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 수정 권한이 없습니다.");
        }

        // 2. Request DTO -> VO 업데이트
        // 필요한 필드만 업데이트합니다. null 또는 빈 값은 업데이트하지 않도록 if문 사용.
        existingVo.setIngredientName(Optional.ofNullable(requestDTO.getIngredientName())
                .filter(name -> !name.isEmpty())
                .orElse(existingVo.getIngredientName()));
        existingVo.setQuantityDesc(Optional.ofNullable(requestDTO.getQuantityDesc())
                .filter(desc -> !desc.isEmpty())
                .orElse(existingVo.getQuantityDesc()));
        existingVo.setCategoryCd(Optional.ofNullable(requestDTO.getCategoryCd())
                .filter(cd -> !cd.isEmpty())
                .orElse(existingVo.getCategoryCd()));
        existingVo.setUsedFlag(Optional.ofNullable(requestDTO.getUsedFlag())
                .filter(flag -> !flag.isEmpty())
                .orElse(existingVo.getUsedFlag()));
        existingVo.setMemo(Optional.ofNullable(requestDTO.getMemo())
                .orElse(existingVo.getMemo()));
        existingVo.setUpdatedId(userId); // 수정자 ID 설정

        // 3. DB에 업데이트
        int updatedCount = userIngredientDAO.updateUserIngredient(existingVo);
        if (updatedCount == 0) {
            throw new RuntimeException("재료 정보 수정에 실패했습니다.");
        }

        return UserIngredientResponseDTO.from(existingVo);
    }

    /**
     * 특정 사용자 재료를 삭제합니다.
     * @param userId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @param userIngredientId 삭제할 특정 재료의 ID
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 재료가 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public boolean deleteUserIngredient(Long userId, Long userIngredientId) {
        // 1. 삭제 전 권한 확인
        UserIngredientVO existingVo = userIngredientDAO.selectUserIngredientById(userIngredientId);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 재료를 찾을 수 없습니다.");
        }
        if (!existingVo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 삭제 권한이 없습니다.");
        }

        // 2. DB에서 삭제
        int deletedCount = userIngredientDAO.deleteUserIngredient(userIngredientId);
        return deletedCount > 0;
    }

    /**
     * 특정 사용자가 보유한 재료의 총 개수를 조회합니다.
     * 마이페이지 메인 화면의 '재료 관리' 카드에 표시됩니다.
     * @param userId 재료 개수를 조회할 사용자의 ID
     * @return 보유 재료의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countUserIngredients(Long userId) {
        // 모든 재료를 가져와서 개수를 세는 방식 (선택)
        // DAO에 countByUserId(Long userId) 메서드를 추가하는 것이 더 효율적일 수 있습니다.
        List<UserIngredientVO> ingredients = userIngredientDAO.selectUserIngredientsByUserId(userId);
        return ingredients.size();
    }
    /**
     * 영수증 인식 결과로 얻은 재료명 리스트를 사용자의 '내 재료'로 추가합니다.
     *
     * @param userId 재료를 추가할 사용자의 ID
     * @param ingredientNames 영수증에서 인식된 재료명 리스트
     * @param createdId 생성자 ID
     * @return 추가된 '내 재료' 정보를 담은 응답 DTO 리스트
     */
    @Override
    @Transactional
    public List<UserIngredientResponseDTO> addIngredientsFromRecognizedReceipt(
            Long userId,
            List<String> ingredientNames,
            Long createdId
    ) {
        if (ingredientNames == null || ingredientNames.isEmpty()) {
            return new ArrayList<>();
        }

        List<UserIngredientResponseDTO> addedIngredients = new ArrayList<>();

        for (String ingredientName : ingredientNames) {
            UserIngredientRequestDTO request = new UserIngredientRequestDTO();
            request.setIngredientName(ingredientName);
            request.setQuantityDesc("1개");  // 기본 수량
            request.setUsedFlag("N");
            // 기본 유통기한 (예시)
            request.setMemo("영수증 인식으로 추가됨");

            try {
                // 기존의 단일 재료 추가 메서드 재활용
                UserIngredientResponseDTO response = addUserIngredient(userId, request);
                addedIngredients.add(response);
            } catch (Exception e) {
                System.err.println("영수증 인식 재료 ('" + ingredientName + "')를 사용자 재료로 추가 실패: " + e.getMessage());
                // 부분 실패를 허용하고 계속 진행
            }
        }
        return addedIngredients;
    }

    @Override
    @Transactional
    public void consumeIngredients(Long userId, IngredientConsumeRequestDTO requestDTO) {
        System.out.println("🔥 재료 소비 시작 - userId: " + userId);
        System.out.println("🔥 recipeId: " + requestDTO.getRecipeId());
        System.out.println("🔥 ingredients: " + requestDTO.getIngredients());

        if (requestDTO.getIngredients() == null || requestDTO.getIngredients().isEmpty()) {
            System.out.println("⚠️ 소비할 재료가 없습니다.");
            return;
        }

        for (IngredientConsumeRequestDTO.ConsumeIngredientDTO item : requestDTO.getIngredients()) {
            System.out.println("📍 재료 처리 - ID: " + item.getUserIngredientId() + ", usageType: " + item.getUsageType());

            if ("ALL".equals(item.getUsageType())) {
                System.out.println("🗑️ 재료 삭제 시도 - userId: " + userId + ", userIngredientId: " + item.getUserIngredientId());
                
                // 삭제 전 재료 존재 확인
                UserIngredientVO existingIngredient = userIngredientDAO.selectUserIngredientById(item.getUserIngredientId());
                if (existingIngredient == null) {
                    System.err.println("❌ 재료를 찾을 수 없습니다 - ID: " + item.getUserIngredientId());
                    throw new IllegalArgumentException("재료를 찾을 수 없습니다: " + item.getUserIngredientId());
                }
                
                if (!existingIngredient.getUserId().equals(userId)) {
                    System.err.println("❌ 권한 없음 - 재료 소유자: " + existingIngredient.getUserId() + ", 요청자: " + userId);
                    throw new IllegalArgumentException("해당 재료에 대한 권한이 없습니다.");
                }
                
                userIngredientDAO.deleteUserIngredientByUserAndId(userId, item.getUserIngredientId());
                System.out.println("✅ 재료 삭제 완료 - ID: " + item.getUserIngredientId());
            } else if ("PARTIAL".equals(item.getUsageType())) {
                System.out.println("ℹ️ 부분 사용 - 삭제하지 않음 (ID: " + item.getUserIngredientId() + ")");
            } else {
                System.err.println("⚠️ 잘못된 usageType: " + item.getUsageType());
            }
        }
        
        System.out.println("✅ 재료 소비 처리 완료");
    }
}
