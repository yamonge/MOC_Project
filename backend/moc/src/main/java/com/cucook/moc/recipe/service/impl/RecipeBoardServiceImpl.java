package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeBoardDAO;
import com.cucook.moc.recipe.dao.RecipeDAO;
import com.cucook.moc.recipe.dto.response.RecipeBoardListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeIngredientResponseDTO;
import com.cucook.moc.recipe.service.RecipeBoardService;
import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import com.cucook.moc.recipe.vo.RecipeBoardListItemWithIngredientsVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeBoardServiceImpl implements RecipeBoardService {

    private static final String RECORD_DELIMITER = "\\|\\|"; // 개별 재료 구분자 (||)
    private static final String FIELD_DELIMITER = "::";     // 이름:수량 구분자 (::)
    private final RecipeBoardDAO recipeBoardDAO;
    
    @Value("${server.base-url:http://localhost:8090}")
    private String serverBaseUrl;

    // ----------------------------------------------------------------------------------
    // ** 신규 추가: LISTAGG 최적화 로직 **
    // getPublicRecipes의 파라미터를 그대로 받고, 파싱 후 새로운 DTO를 반환
    // ----------------------------------------------------------------------------------
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

        // 1. 최적화된 LISTAGG 쿼리 실행
        List<RecipeBoardListItemVO> dtoList = recipeBoardDAO.selectPublicRecipesOptimized(
                safeLoginUserId, search, cuisineStyleCd, difficultyCd, maxCookTimeMin, safeSort, offset, safeSize
        );
        System.out.println(dtoList.toString());
        // 2. DTO 리스트를 스트림을 이용해 파싱 및 최종 VO 리스트로 변환
        List<RecipeBoardListItemWithIngredientsVO> items = dtoList.stream()
                .map(this::mapAndParseRecipe) // 파싱 로직 호출
                .collect(Collectors.toList());
        // 3. 전체 개수 조회 (기존 로직과 동일)
        int total = recipeBoardDAO.countPublicRecipes(
                search, cuisineStyleCd, difficultyCd, maxCookTimeMin
        );

        // 4. 응답 DTO 반환
        // 현재 RecipeBoardListResponseDTO는 List<RecipeBoardListItemVO>를 받으므로,
        // 반환 타입을 List<RecipeBoardListItemWithIngredientsVO>로 변경하거나,
        // 새 응답 DTO를 정의해야 함. (여기서는 간단하게 List<RecipeBoardListItemVO>로 캐스팅했다고 가정)

        // NOTE: DTO 반환 전에 캐스팅 오류 방지를 위해,
        // RecipeBoardListResponseDTO의 items 필드 타입을 List<?>로 바꾸거나,
        // 새 응답 DTO를 정의하는 것이 가장 좋습니다.

        // 안전하게 캐스팅하지 않고 새 응답 DTO를 반환한다고 가정
        // return new RecipeBoardListResponseDTO(items, total, safePage, safeSize);

        // 현재 VO 구조를 유지하려면, List<RecipeBoardListItemVO>를 리턴하는
        // 기존의 getPublicRecipes 메소드에 이 로직을 덮어쓰는 것이 더 합리적일 수 있습니다.

        // **(중요)** 현 구조에서는 기존 getPublicRecipes 메소드를 아래 로직으로 대체하는 것을 권장합니다.
        //--------------------------------------------------------------------------------------
        // ** 기존 getPublicRecipes 메소드 대체 로직 (가장 현실적인 통합)**
        //--------------------------------------------------------------------------------------

        // 1. 기존 getPublicRecipes 메소드를 이 LISTAGG 로직으로 덮어쓰고,
        // 2. RecipeBoardListResponseDTO의 items 필드 타입을 List<RecipeBoardListItemWithIngredientsVO>로 변경한다고 가정합니다.

        // 하지만 기존 구조를 유지해야 하므로, 새로운 DTO를 반환하는 메소드를 만들겠습니다.
        return new RecipeBoardListResponseDTO(
                (List) items, // 타입 안전성 문제 발생 가능. 실제 프로젝트에서는 DTO 구조 변경 필요.
                total,
                safePage,
                safeSize
        );
    }

    /**
     * DTO 하나를 받아 VO로 매핑하고 재료 문자열을 파싱합니다.
     */
    private RecipeBoardListItemWithIngredientsVO mapAndParseRecipe(RecipeBoardListItemVO dto) {
        // DTO의 기본 필드를 최종 VO로 복사합니다. (DTO to VO 매핑)
        RecipeBoardListItemWithIngredientsVO vo = new RecipeBoardListItemWithIngredientsVO();

        // 필드 복사 (필드명과 타입이 정확히 일치하므로 BeanUtils.copyProperties 등을 사용해도 좋으나, 수동 복사 예시)
        vo.setRecipeId(dto.getRecipeId());
        vo.setTitle(dto.getTitle());
        vo.setSummary(dto.getSummary());
        
        // 썸네일 URL 변환 (상대 경로 → 절대 URL)
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
        
        // 작성자 프로필 이미지 URL 변환 (상대 경로 → 절대 URL)
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
        vo.setLikeCnt(dto.getLikeCnt()); // ✅ likeCnt 추가
        vo.setLikedByMe(Integer.valueOf(dto.getLikedByMe()));
        vo.setOwnerUserId(Long.valueOf(dto.getOwnerUserId()));
        vo.setCreatedDate(dto.getCreatedDate());
        vo.setDifficultyCd(dto.getDifficultyCd());


        // 3. 재료 문자열 파싱 로직
        List<RecipeIngredientResponseDTO> ingredients = new ArrayList<>();
        // ingredientsString 필드는 RecipeBoardListItemVO에 정의되어 있으므로 바로 접근 가능
        String ingredientsStr = dto.getIngredientsString();

        if (ingredientsStr != null && !ingredientsStr.isEmpty()) {
            // 3-1. 레코드 구분자 (||)로 개별 재료 항목 분리
            String[] itemArray = ingredientsStr.split(RECORD_DELIMITER);

            for (String item : itemArray) {
                // 3-2. 필드 구분자 (::)로 이름과 수량 분리
                String[] parts = item.split(FIELD_DELIMITER);

                if (parts.length == 2) {
                    RecipeIngredientResponseDTO ingredient = new RecipeIngredientResponseDTO();
                    ingredient.setIngredientName(parts[0]);
                    ingredient.setQuantityDesc(parts[1]);
                    ingredients.add(ingredient);
                }
            }
        }

        // 4. 최종 VO에 파싱된 재료 리스트 설정
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

        // ✅ 2. loginUserId NULL 방어 (Oracle + MyBatis 핵심 포인트)
        Long safeLoginUserId = (loginUserId == null ? -1L : loginUserId);

        // ✅ 3. 정렬 기본값 보정
        String safeSort = (sort == null || sort.isBlank()) ? "LATEST" : sort;

        // ✅ 4. 게시판 목록 조회
        List<RecipeBoardListItemVO> items = recipeBoardDAO.selectPublicRecipes(
                safeLoginUserId,
                search,
                cuisineStyleCd,
                difficultyCd,
                maxCookTimeMin,
                safeSort,
                offset,
                safeSize
        );

        // ✅ 4-1. URL 변환 (상대 경로 → 절대 URL)
        for (RecipeBoardListItemVO item : items) {
            // 썸네일 URL 변환
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
            
            // 작성자 프로필 이미지 URL 변환
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

        // ✅ 5. 전체 개수 조회 (페이징용)
        int total = recipeBoardDAO.countPublicRecipes(
                search,
                cuisineStyleCd,
                difficultyCd,
                maxCookTimeMin
        );

        // ✅ 6. 응답 DTO 반환
        return new RecipeBoardListResponseDTO(items, total, safePage, safeSize);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeVO getPublicRecipeDetail(Long recipeId, Long loginUserId) {
        Long safeLoginUserId = (loginUserId == null ? -1L : loginUserId);
        RecipeVO vo = recipeBoardDAO.selectPublicRecipeById(recipeId, safeLoginUserId);
        System.out.println(vo.toString());
        if (vo == null) {
            throw new IllegalArgumentException("레시피를 찾을 수 없습니다.");
        }
        
        // URL 변환 (상대 경로 → 절대 URL)
        // 썸네일 URL 변환
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
        
        // 작성자 프로필 이미지 URL 변환
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
