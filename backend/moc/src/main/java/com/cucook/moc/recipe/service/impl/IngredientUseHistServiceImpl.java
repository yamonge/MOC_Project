package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.IngredientUseHistRepository;
import com.cucook.moc.recipe.dto.response.IngredientUseHistListResponseDTO;
import com.cucook.moc.recipe.dto.response.IngredientUseHistResponseDTO;
import com.cucook.moc.recipe.service.IngredientUseHistService;
import com.cucook.moc.recipe.vo.IngredientUseHistVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientUseHistServiceImpl implements IngredientUseHistService {

    private final IngredientUseHistRepository ingredientUseHistRepository;

    @Autowired
    public IngredientUseHistServiceImpl(IngredientUseHistRepository ingredientUseHistRepository) {
        this.ingredientUseHistRepository = ingredientUseHistRepository;
    }

    @Override
    @Transactional
    public IngredientUseHistResponseDTO addIngredientUseHist(IngredientUseHistVO histVO) {
        if (histVO.getUserId() == null || histVO.getUserIngredientId() == null) {
            throw new IllegalArgumentException("사용자 ID와 사용자 재료 ID는 필수입니다.");
        }
        if (histVO.getCreatedId() == null) {
            histVO.setCreatedId(histVO.getUserId());
        }

        IngredientUseHistVO saved = ingredientUseHistRepository.save(histVO);
        if (saved.getIngredientUseHistId() == null) {
            throw new RuntimeException("재료 사용 이력 저장에 실패했습니다.");
        }

        return IngredientUseHistResponseDTO.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistResponseDTO getIngredientUseHistById(Long ingredientUseHistId) {
        IngredientUseHistVO vo = ingredientUseHistRepository.findById(ingredientUseHistId).orElse(null);
        return vo != null ? IngredientUseHistResponseDTO.from(vo) : null;
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistListResponseDTO getIngredientUseHistsByUserId(Long userId) {
        List<IngredientUseHistVO> voList = ingredientUseHistRepository.findByUserId(userId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistListResponseDTO getIngredientUseHistsByUserIngredientId(Long userIngredientId) {
        List<IngredientUseHistVO> voList = ingredientUseHistRepository.findByUserIngredientId(userIngredientId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientUseHistListResponseDTO getIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId) {
        List<IngredientUseHistVO> voList = ingredientUseHistRepository.findByUserIdAndRecipeId(userId, recipeId);

        List<IngredientUseHistResponseDTO> dtoList = voList.stream()
                .map(IngredientUseHistResponseDTO::from)
                .collect(Collectors.toList());

        return new IngredientUseHistListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public int countIngredientUseHistsByUserId(Long userId) {
        return ingredientUseHistRepository.countByUserId(userId);
    }

    @Override
    @Transactional
    public boolean deleteIngredientUseHist(Long ingredientUseHistId) {
        IngredientUseHistVO existingVo = ingredientUseHistRepository.findById(ingredientUseHistId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 재료 사용 이력 (ID: " + ingredientUseHistId + ")을 찾을 수 없습니다.");
        }
        ingredientUseHistRepository.deleteById(ingredientUseHistId);
        return true;
    }

    @Override
    @Transactional
    public int deleteIngredientUseHistsByRecipeAndUser(Long userId, Long recipeId) {
        return ingredientUseHistRepository.deleteByUserIdAndRecipeId(userId, recipeId);
    }
}
