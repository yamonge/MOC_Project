package com.cucook.moc.recipe.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class RecipeBoardListItemResponseDTO {

    private Long recipeId;
    private String title;
    private String thumbnailUrl;
    private String difficultyCd;
    private Integer cookTimeMin;
    private String cuisineStyleCd;
    private String category;
    private Integer likeCnt;
    private Integer viewCnt;
    private Long ownerUserId;
    private String authorNickname;
    private String authorProfileImageUrl;
    private Integer likedByMe;
    private String ingredientSummary;
}
