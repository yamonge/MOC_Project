package com.cucook.moc.recipe.dto.response; // ⭐ recipe 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime; // UI 표시용
import java.time.format.DateTimeFormatter; // 날짜 포맷팅용

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeLikeResponseDTO {
    private Long likeId;          // 좋아요 ID (tb_recipe_like.recipe_like_id)
    private Long recipeId;        // 레시피 ID (tb_recipe_like.recipe_id)
    private Long userId;          // 사용자 ID (tb_recipe_like.user_id)
    private Timestamp createdDate; // DDL의 created_date, VO의 createdDate와 매핑. (DB에서 좋아요 누른 일시)
    private String likedDateFormatted; // ⭐ UI 표시용: "YYYY-MM-DD HH:mm:ss" 포맷
    private String authorNickname;
    // ⭐ LikedRecipeDetailDTO를 포함하여 레시피 상세 정보를 제공
    private LikedRecipeDetailDTO recipe;

    // RecipeLikeVO와 RecipeVO를 기반으로 DTO를 생성하는 편의 메서드 (선택 사항)
    // Service 계층에서 RecipeLikeVO와 RecipeVO를 조합하여 DTO를 만들 때 사용
    public static RecipeLikeResponseDTO from(
            com.cucook.moc.recipe.vo.RecipeLikeVO likeVO,
            com.cucook.moc.recipe.vo.RecipeVO recipeVO) {

        RecipeLikeResponseDTO dto = new RecipeLikeResponseDTO();
        dto.setLikeId(likeVO.getLikeId());
        dto.setRecipeId(likeVO.getRecipeId());
        dto.setUserId(likeVO.getUserId());
        dto.setCreatedDate(likeVO.getCreatedDate());

        // UI 표시용 날짜 포맷팅
        if (likeVO.getCreatedDate() != null) {
            LocalDateTime dateTime = likeVO.getCreatedDate().toLocalDateTime();
            dto.setLikedDateFormatted(dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        } else {
            dto.setLikedDateFormatted(null);
        }

        // LikedRecipeDetailDTO 생성 (RecipeVO를 LikedRecipeDetailDTO로 변환)
        if (recipeVO != null) {
            LikedRecipeDetailDTO recipeDetail = new LikedRecipeDetailDTO();
            recipeDetail.setRecipeId(recipeVO.getRecipeId());
            recipeDetail.setTitle(recipeVO.getTitle());
            recipeDetail.setSummary(recipeVO.getSummary());
            recipeDetail.setThumbnailUrl(recipeVO.getThumbnailUrl());
            recipeDetail.setDifficultyCd(recipeVO.getDifficultyCd());
            recipeDetail.setCookTimeMin(recipeVO.getCookTimeMin());
            recipeDetail.setCuisineStyleCd(recipeVO.getCuisineStyleCd());
            recipeDetail.setViewCnt(recipeVO.getViewCnt());
            recipeDetail.setLikeCnt(recipeVO.getLikeCnt());
            recipeDetail.setAuthorNickname(recipeVO.getAuthorNickname());
            dto.setRecipe(recipeDetail);
        }

        return dto;
    }
}