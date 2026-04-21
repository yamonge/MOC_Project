package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserIngredientRepository;
import com.cucook.moc.user.dto.request.IngredientConsumeRequestDTO;
import com.cucook.moc.user.dto.request.UserIngredientRequestDTO;
import com.cucook.moc.user.dto.response.UserIngredientListResponseDTO;
import com.cucook.moc.user.dto.response.UserIngredientResponseDTO;
import com.cucook.moc.user.vo.UserIngredientVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserIngredientServiceImpl implements UserIngredientService {

    private static final Logger log = LoggerFactory.getLogger(UserIngredientServiceImpl.class);

    private final UserIngredientRepository userIngredientRepository;

    @Autowired
    public UserIngredientServiceImpl(UserIngredientRepository userIngredientRepository) {
        this.userIngredientRepository = userIngredientRepository;
    }

    @Override
    @Transactional
    public UserIngredientResponseDTO addUserIngredient(Long userId, UserIngredientRequestDTO requestDTO) {
        String ingredientName = requestDTO.getIngredientName();
        UserIngredientVO existingIngredient = userIngredientRepository.findFirstByUserIdAndIngredientNameIgnoreCase(userId, ingredientName);

        if (existingIngredient != null) {
            log.info("중복 재료 감지: userId={}, ingredientName={}", userId, ingredientName);
            return UserIngredientResponseDTO.from(existingIngredient);
        }

        UserIngredientVO vo = new UserIngredientVO();
        vo.setUserId(userId);
        vo.setIngredientName(requestDTO.getIngredientName());
        vo.setQuantityDesc(
                Optional.ofNullable(requestDTO.getQuantityDesc())
                        .filter(v -> !v.isBlank())
                        .orElse("1개")
        );
        vo.setCategoryCd(requestDTO.getCategoryCd());
        vo.setUsedFlag(requestDTO.getUsedFlag() != null ? requestDTO.getUsedFlag() : "N");
        vo.setMemo(
                Optional.ofNullable(requestDTO.getMemo())
                        .orElse("")
        );
        vo.setCreatedId(userId);

        vo = userIngredientRepository.save(vo);

        return UserIngredientResponseDTO.from(vo);
    }

    @Override
    @Transactional(readOnly = true)
    public UserIngredientListResponseDTO getUserIngredients(Long userId) {
        List<UserIngredientVO> voList = userIngredientRepository.findByUserId(userId);

        List<UserIngredientResponseDTO> dtoList = voList.stream()
                .map(UserIngredientResponseDTO::from)
                .collect(Collectors.toList());

        return new UserIngredientListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public UserIngredientResponseDTO getUserIngredientDetail(Long userId, Long userIngredientId) {
        UserIngredientVO vo = userIngredientRepository.findById(userIngredientId).orElse(null);

        if (vo == null) {
            throw new IllegalArgumentException("해당 재료를 찾을 수 없습니다.");
        }
        if (!vo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 조회 권한이 없습니다.");
        }

        return UserIngredientResponseDTO.from(vo);
    }

    @Override
    @Transactional
    public UserIngredientResponseDTO updateUserIngredient(Long userId, Long userIngredientId, UserIngredientRequestDTO requestDTO) {
        UserIngredientVO existingVo = userIngredientRepository.findById(userIngredientId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 재료를 찾을 수 없습니다.");
        }
        if (!existingVo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 수정 권한이 없습니다.");
        }

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
        existingVo.setUpdatedId(userId);

        existingVo = userIngredientRepository.save(existingVo);

        return UserIngredientResponseDTO.from(existingVo);
    }

    @Override
    @Transactional
    public boolean deleteUserIngredient(Long userId, Long userIngredientId) {
        UserIngredientVO existingVo = userIngredientRepository.findById(userIngredientId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 재료를 찾을 수 없습니다.");
        }
        if (!existingVo.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 재료에 대한 삭제 권한이 없습니다.");
        }

        userIngredientRepository.deleteById(userIngredientId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public int countUserIngredients(Long userId) {
        List<UserIngredientVO> ingredients = userIngredientRepository.findByUserId(userId);
        return ingredients.size();
    }

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
            request.setQuantityDesc("1개");
            request.setUsedFlag("N");
            request.setMemo("영수증 인식으로 추가됨");

            try {
                UserIngredientResponseDTO response = addUserIngredient(userId, request);
                addedIngredients.add(response);
            } catch (Exception e) {
                log.error("영수증 인식 재료 ('{}')를 사용자 재료로 추가 실패: {}", ingredientName, e.getMessage());
            }
        }
        return addedIngredients;
    }

    @Override
    @Transactional
    public void consumeIngredients(Long userId, IngredientConsumeRequestDTO requestDTO) {
        log.info("재료 소비 시작 - userId: {}", userId);
        log.info("recipeId: {}", requestDTO.getRecipeId());
        log.info("ingredients: {}", requestDTO.getIngredients());

        if (requestDTO.getIngredients() == null || requestDTO.getIngredients().isEmpty()) {
            log.info("소비할 재료가 없습니다.");
            return;
        }

        for (IngredientConsumeRequestDTO.ConsumeIngredientDTO item : requestDTO.getIngredients()) {
            log.info("재료 처리 - ID: {}, usageType: {}", item.getUserIngredientId(), item.getUsageType());

            if ("ALL".equals(item.getUsageType())) {
                log.info("재료 삭제 시도 - userId: {}, userIngredientId: {}", userId, item.getUserIngredientId());
                
                UserIngredientVO existingIngredient = userIngredientRepository.findById(item.getUserIngredientId()).orElse(null);
                if (existingIngredient == null) {
                    log.error("재료를 찾을 수 없습니다 - ID: {}", item.getUserIngredientId());
                    throw new IllegalArgumentException("재료를 찾을 수 없습니다: " + item.getUserIngredientId());
                }
                
                if (!existingIngredient.getUserId().equals(userId)) {
                    log.error("권한 없음 - 재료 소유자: {}, 요청자: {}", existingIngredient.getUserId(), userId);
                    throw new IllegalArgumentException("해당 재료에 대한 권한이 없습니다.");
                }
                
                userIngredientRepository.deleteByUserIdAndUserIngredientId(userId, item.getUserIngredientId());
                log.info("재료 삭제 완료 - ID: {}", item.getUserIngredientId());
            } else if ("PARTIAL".equals(item.getUsageType())) {
                log.info("부분 사용 - 삭제하지 않음 (ID: {})", item.getUserIngredientId());
            } else {
                log.error("잘못된 usageType: {}", item.getUsageType());
            }
        }
        
        log.info("재료 소비 처리 완료");
    }
}
