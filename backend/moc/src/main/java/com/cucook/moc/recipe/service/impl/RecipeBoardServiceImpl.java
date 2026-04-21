package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeBoardRepository;
import com.cucook.moc.recipe.dto.response.RecipeBoardListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeIngredientResponseDTO;
import com.cucook.moc.recipe.service.RecipeBoardService;
import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import com.cucook.moc.recipe.vo.RecipeBoardListItemWithIngredientsVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeBoardServiceImpl implements RecipeBoardService {

    private static final Logger log = LoggerFactory.getLogger(RecipeBoardServiceImpl.class);

    private static final String RECORD_DELIMITER = "\\|\\|";
    private static final String FIELD_DELIMITER = "::";
    private final RecipeBoardRepository recipeBoardRepository;

    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;

    @Override
    @Transactional(readOnly = true)
    public RecipeBoardListResponseDTO getPublicRecipesOptimized(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        int offset = safePage * safeSize;

        Long safeLoginUserId = (loginUserId == null ? -1L : loginUserId);
        String safeSort = (sort == null || sort.isBlank()) ? "LATEST" : sort;

        List<RecipeBoardListItemVO> dtoList = recipeBoardRepository.findPublicRecipesOptimized(
                safeLoginUserId, search, cuisineStyleCd, difficultyCd, maxCookTimeMin, safeSort, offset, safeSize
        );
        log.info("{}", dtoList);

        List<RecipeBoardListItemWithIngredientsVO> items = dtoList.stream()
                .map(this::mapAndParseRecipe)
                .collect(Collectors.toList());

        int total = recipeBoardRepository.countPublicRecipes(
                search, cuisineStyleCd, difficultyCd, maxCookTimeMin
        );

        return new RecipeBoardListResponseDTO(
                (List) items,
                total,
                safePage,
                safeSize
        );
    }

    private RecipeBoardListItemWithIngredientsVO mapAndParseRecipe(RecipeBoardListItemVO dto) {
        RecipeBoardListItemWithIngredientsVO vo = new RecipeBoardListItemWithIngredientsVO();

        vo.setRecipeId(dto.getRecipeId());
        vo.setTitle(dto.getTitle());
        vo.setSummary(dto.getSummary());

        String thumbnailUrl = dto.getThumbnailUrl();
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
            if (!thumbnailUrl.startsWith("http://") && !thumbnailUrl.startsWith("https://")) {
                if (!thumbnailUrl.startsWith("/uploads/")) {
                    if (thumbnailUrl.startsWith("recipe/")) {
                        thumbnailUrl = "/uploads/" + thumbnailUrl;
                    } else if (thumbnailUrl.startsWith("/recipe/")) {
                        thumbnailUrl = "/uploads" + thumbnailUrl;
                    } else {
                        thumbnailUrl = "/uploads/" + thumbnailUrl;
                    }
                }
                thumbnailUrl = serverBaseUrl + thumbnailUrl;
            }
        }
        vo.setThumbnailUrl(thumbnailUrl);

        vo.setLikedByMe(dto.getLikedByMe());
        vo.setAuthorNickname(dto.getAuthorNickname());

        String authorProfileImageUrl = dto.getAuthorProfileImageUrl();
        if (authorProfileImageUrl != null && !authorProfileImageUrl.isEmpty()) {
            if (!authorProfileImageUrl.startsWith("http://") && !authorProfileImageUrl.startsWith("https://")) {
                if (!authorProfileImageUrl.startsWith("/uploads/")) {
                    if (authorProfileImageUrl.startsWith("profile/")) {
                        authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                    } else if (authorProfileImageUrl.startsWith("/profile/")) {
                        authorProfileImageUrl = "/uploads" + authorProfileImageUrl;
                    } else {
                        authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                    }
                }
                authorProfileImageUrl = serverBaseUrl + authorProfileImageUrl;
            }
        }
        vo.setAuthorProfileImageUrl(authorProfileImageUrl);

        vo.setCookTimeMin(dto.getCookTimeMin());
        vo.setCuisineStyleCd(dto.getCuisineStyleCd());
        vo.setCategory(dto.getCategory());
        vo.setViewCnt(Integer.valueOf(dto.getViewCnt()));
        vo.setLikeCnt(dto.getLikeCnt());
        vo.setLikedByMe(Integer.valueOf(dto.getLikedByMe()));
        vo.setOwnerUserId(Long.valueOf(dto.getOwnerUserId()));
        vo.setCreatedDate(dto.getCreatedDate());
        vo.setDifficultyCd(dto.getDifficultyCd());

        List<RecipeIngredientResponseDTO> ingredients = new ArrayList<>();
        String ingredientsStr = dto.getIngredientsString();

        if (ingredientsStr != null && !ingredientsStr.isEmpty()) {
            String[] itemArray = ingredientsStr.split(RECORD_DELIMITER);

            for (String item : itemArray) {
                String[] parts = item.split(FIELD_DELIMITER);

                if (parts.length == 2) {
                    RecipeIngredientResponseDTO ingredient = new RecipeIngredientResponseDTO();
                    ingredient.setIngredientName(parts[0]);
                    ingredient.setQuantityDesc(parts[1]);
                    ingredients.add(ingredient);
                }
            }
        }

        vo.setIngredients(ingredients);

        return vo;
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeBoardListResponseDTO getPublicRecipes(
            Long loginUserId,
            String search,
            String cuisineStyleCd,
            String difficultyCd,
            Integer maxCookTimeMin,
            String sort,
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        int offset = safePage * safeSize;

        Long safeLoginUserId = (loginUserId == null ? -1L : loginUserId);
        String safeSort = (sort == null || sort.isBlank()) ? "LATEST" : sort;

        List<RecipeBoardListItemVO> items = recipeBoardRepository.findPublicRecipes(
                safeLoginUserId,
                search,
                cuisineStyleCd,
                difficultyCd,
                maxCookTimeMin,
                safeSort,
                offset,
                safeSize
        );

        for (RecipeBoardListItemVO item : items) {
            String thumbnailUrl = item.getThumbnailUrl();
            if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                if (!thumbnailUrl.startsWith("http://") && !thumbnailUrl.startsWith("https://")) {
                    if (!thumbnailUrl.startsWith("/uploads/")) {
                        if (thumbnailUrl.startsWith("recipe/")) {
                            thumbnailUrl = "/uploads/" + thumbnailUrl;
                        } else if (thumbnailUrl.startsWith("/recipe/")) {
                            thumbnailUrl = "/uploads" + thumbnailUrl;
                        } else {
                            thumbnailUrl = "/uploads/" + thumbnailUrl;
                        }
                    }
                    thumbnailUrl = serverBaseUrl + thumbnailUrl;
                }
                item.setThumbnailUrl(thumbnailUrl);
            }

            String authorProfileImageUrl = item.getAuthorProfileImageUrl();
            if (authorProfileImageUrl != null && !authorProfileImageUrl.isEmpty()) {
                if (!authorProfileImageUrl.startsWith("http://") && !authorProfileImageUrl.startsWith("https://")) {
                    if (!authorProfileImageUrl.startsWith("/uploads/")) {
                        if (authorProfileImageUrl.startsWith("profile/")) {
                            authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                        } else if (authorProfileImageUrl.startsWith("/profile/")) {
                            authorProfileImageUrl = "/uploads" + authorProfileImageUrl;
                        } else {
                            authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                        }
                    }
                    authorProfileImageUrl = serverBaseUrl + authorProfileImageUrl;
                }
                item.setAuthorProfileImageUrl(authorProfileImageUrl);
            }
        }

        int total = recipeBoardRepository.countPublicRecipes(
                search,
                cuisineStyleCd,
                difficultyCd,
                maxCookTimeMin
        );

        return new RecipeBoardListResponseDTO(items, total, safePage, safeSize);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeVO getPublicRecipeDetail(Long recipeId, Long loginUserId) {
        Long safeLoginUserId = (loginUserId == null ? -1L : loginUserId);
        RecipeVO vo = recipeBoardRepository.findPublicRecipeById(recipeId, safeLoginUserId);
        log.info("{}", vo);
        if (vo == null) {
            throw new IllegalArgumentException("레시피를 찾을 수 없습니다.");
        }

        String thumbnailUrl = vo.getThumbnailUrl();
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
            if (!thumbnailUrl.startsWith("http://") && !thumbnailUrl.startsWith("https://")) {
                if (!thumbnailUrl.startsWith("/uploads/")) {
                    if (thumbnailUrl.startsWith("recipe/")) {
                        thumbnailUrl = "/uploads/" + thumbnailUrl;
                    } else if (thumbnailUrl.startsWith("/recipe/")) {
                        thumbnailUrl = "/uploads" + thumbnailUrl;
                    } else {
                        thumbnailUrl = "/uploads/" + thumbnailUrl;
                    }
                }
                thumbnailUrl = serverBaseUrl + thumbnailUrl;
            }
            vo.setThumbnailUrl(thumbnailUrl);
        }

        String authorProfileImageUrl = vo.getAuthorProfileImageUrl();
        if (authorProfileImageUrl != null && !authorProfileImageUrl.isEmpty()) {
            if (!authorProfileImageUrl.startsWith("http://") && !authorProfileImageUrl.startsWith("https://")) {
                if (!authorProfileImageUrl.startsWith("/uploads/")) {
                    if (authorProfileImageUrl.startsWith("profile/")) {
                        authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                    } else if (authorProfileImageUrl.startsWith("/profile/")) {
                        authorProfileImageUrl = "/uploads" + authorProfileImageUrl;
                    } else {
                        authorProfileImageUrl = "/uploads/" + authorProfileImageUrl;
                    }
                }
                authorProfileImageUrl = serverBaseUrl + authorProfileImageUrl;
            }
            vo.setAuthorProfileImageUrl(authorProfileImageUrl);
        }

        return vo;
    }
}
