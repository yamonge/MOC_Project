package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeBookmarkRepository;
import com.cucook.moc.recipe.dao.RecipeRepository;
import com.cucook.moc.recipe.dto.request.RecipeBookmarkRequestDTO;
import com.cucook.moc.recipe.dto.response.BookmarkedRecipeDetailDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeBookmarkResponseDTO;
import com.cucook.moc.recipe.service.RecipeBookmarkService;
import com.cucook.moc.recipe.vo.RecipeBookmarkVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeBookmarkServiceImpl implements RecipeBookmarkService {

    private static final Logger log = LoggerFactory.getLogger(RecipeBookmarkServiceImpl.class);

    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeBookmarkServiceImpl(RecipeBookmarkRepository recipeBookmarkRepository,
                                     RecipeRepository recipeRepository) {
        this.recipeBookmarkRepository = recipeBookmarkRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    @Transactional
    public RecipeBookmarkResponseDTO addRecipeBookmark(Long userId, RecipeBookmarkRequestDTO requestDTO) {
        Long recipeId = requestDTO.getRecipeId();

        RecipeVO recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) {
            throw new IllegalArgumentException("존재하지 않는 레시피입니다. (Recipe ID: " + recipeId + ")");
        }

        if (recipeBookmarkRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            log.info("레시피 (ID: {})는 이미 사용자 (ID: {})에 의해 북마크되어 있습니다.", recipeId, userId);
        }

        RecipeBookmarkVO vo = new RecipeBookmarkVO();
        vo.setUserId(userId);
        vo.setRecipeId(recipeId);
        vo.setCreatedId(userId);

        RecipeBookmarkVO saved = recipeBookmarkRepository.save(vo);
        if (saved.getBookmarkId() == null) {
            throw new RuntimeException("레시피 북마크 저장에 실패했습니다. (DB 오류)");
        }

        return RecipeBookmarkResponseDTO.from(saved, recipe);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeBookmarkListResponseDTO getBookmarkedRecipes(Long userId) {
        List<RecipeBookmarkRepository.RecipeBookmarkDetailProjection> projections =
                recipeBookmarkRepository.findBookmarksWithDetailByUserId(userId);

        List<RecipeBookmarkResponseDTO> dtoList = projections.stream().map(p -> {
            RecipeBookmarkResponseDTO dto = new RecipeBookmarkResponseDTO();
            dto.setBookmarkId(p.getBookmarkId());
            dto.setUserId(p.getUserId());
            dto.setRecipeId(p.getRecipeId());
            dto.setCreatedDate(p.getCreatedDate());

            BookmarkedRecipeDetailDTO recipe = new BookmarkedRecipeDetailDTO();
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
            dto.setRecipe(recipe);

            return dto;
        }).collect(Collectors.toList());

        return new RecipeBookmarkListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional
    public boolean deleteRecipeBookmark(Long userId, Long recipeId) {
        if (!recipeBookmarkRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            throw new IllegalArgumentException("사용자(ID: " + userId + ")가 북마크하지 않았거나 존재하지 않는 레시피(ID: " + recipeId + ")입니다.");
        }

        int deletedCount = recipeBookmarkRepository.deleteByUserIdAndRecipeId(userId, recipeId);
        return deletedCount > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isRecipeBookmarked(Long userId, Long recipeId) {
        return recipeBookmarkRepository.existsByUserIdAndRecipeId(userId, recipeId);
    }

    @Override
    @Transactional(readOnly = true)
    public int countBookmarkedRecipes(Long userId) {
        return recipeBookmarkRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeBookmarkListResponseDTO getMyPublicRecipes(Long userId) {

        List<RecipeVO> recipes =
                recipeRepository.findByOwnerUserIdAndIsPublic(userId, "Y");

        List<RecipeBookmarkResponseDTO> list =
                recipes.stream()
                        .map(RecipeBookmarkResponseDTO::fromRecipe)
                        .toList();

        return new RecipeBookmarkListResponseDTO(list, list.size());
    }
}
