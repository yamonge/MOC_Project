package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeLikeRepository;
import com.cucook.moc.recipe.dao.RecipeRepository;
import com.cucook.moc.recipe.dto.request.RecipeLikeRequestDTO;
import com.cucook.moc.recipe.dto.response.LikedRecipeDetailDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeLikeResponseDTO;
import com.cucook.moc.recipe.service.RecipeLikeService;
import com.cucook.moc.recipe.vo.RecipeLikeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeLikeServiceImpl implements RecipeLikeService {

    private final RecipeLikeRepository recipeLikeRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeLikeServiceImpl(RecipeLikeRepository recipeLikeRepository,
                                 RecipeRepository recipeRepository) {
        this.recipeLikeRepository = recipeLikeRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    @Transactional
    public boolean toggleRecipeLike(Long userId, RecipeLikeRequestDTO requestDTO) {
        Long recipeId = requestDTO.getRecipeId();

        boolean recipeExists = recipeRepository.existsById(recipeId);
        if (!recipeExists) {
            throw new IllegalArgumentException("존재하지 않는 레시피입니다. (Recipe ID: " + recipeId + ")");
        }

        boolean isCurrentlyLiked = recipeLikeRepository.existsByUserIdAndRecipeId(userId, recipeId);

        if (isCurrentlyLiked) {
            int deletedCount = recipeLikeRepository.deleteByUserIdAndRecipeId(userId, recipeId);
            if (deletedCount > 0) {
                recipeRepository.decrementRecipeLikeCount(recipeId);
                return false;
            }
        } else {
            RecipeLikeVO vo = new RecipeLikeVO();
            vo.setUserId(userId);
            vo.setRecipeId(recipeId);
            vo.setCreatedId(userId);

            RecipeLikeVO saved = recipeLikeRepository.save(vo);
            if (saved.getLikeId() != null) {
                recipeRepository.incrementRecipeLikeCount(recipeId);
                return true;
            }
        }

        throw new RuntimeException("좋아요 상태 변경에 실패했습니다.");
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeLikeListResponseDTO getLikedRecipes(Long userId) {
        List<RecipeLikeRepository.RecipeLikeDetailProjection> projections =
                recipeLikeRepository.findLikesWithDetailByUserId(userId);

        List<RecipeLikeResponseDTO> dtoList = projections.stream().map(p -> {
            RecipeLikeResponseDTO dto = new RecipeLikeResponseDTO();
            dto.setLikeId(p.getLikeId());
            dto.setRecipeId(p.getRecipeId());
            dto.setUserId(p.getUserId());
            dto.setCreatedDate(p.getCreatedDate());

            LikedRecipeDetailDTO recipe = new LikedRecipeDetailDTO();
            recipe.setRecipeId(p.getRecipePkId());
            recipe.setTitle(p.getRecipeTitle());
            recipe.setSummary(p.getSummary());
            recipe.setThumbnailUrl(p.getThumbnailUrl());
            recipe.setDifficultyCd(p.getDifficultyCd());
            recipe.setCookTimeMin(p.getCookTimeMin());
            recipe.setCuisineStyleCd(p.getCuisineStyleCd());
            recipe.setViewCnt(p.getViewCnt());
            recipe.setLikeCnt(p.getLikeCnt());
            recipe.setAuthorNickname(p.getAuthorNickname());
            recipe.setLikedByMe(1);
            dto.setRecipe(recipe);

            return dto;
        }).collect(Collectors.toList());

        return new RecipeLikeListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isRecipeLiked(Long userId, Long recipeId) {
        return recipeLikeRepository.existsByUserIdAndRecipeId(userId, recipeId);
    }

    @Override
    @Transactional(readOnly = true)
    public int countLikedRecipes(Long userId) {
        return recipeLikeRepository.countByUserId(userId);
    }
}
