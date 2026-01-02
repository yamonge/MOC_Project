package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class RecipeBoardDetailResponseDTO {

    private Long recipeId;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String difficultyCd;
    private Integer cookTimeMin;
    private String cuisineStyleCd;
    private String category;
    private Integer viewCnt;
    private Integer likeCnt;
    private Integer reportCnt;
    private Long ownerUserId;
    private String authorNickname;
    private String authorProfileImageUrl;
    private Integer likedByMe;
    private List<RecipeIngredientResponseDTO> ingredients;
    private List<RecipeStepResponseDTO> steps;
}
