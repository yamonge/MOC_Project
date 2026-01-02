package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;
import java.util.List;

@Data
public class RecipeVO {

    private Long recipeId;
    private Long ownerUserId;
    private String sourceType;
    private String externalRefId;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String difficultyCd;
    private Integer cookTimeMin;
    private String cuisineStyleCd;
    private String category;
    private String authorNickname;
    private String authorProfileImageUrl;
    private Integer likedByMe;
    private String isPublic;
    private String isDeleted;
    private Integer viewCnt;
    private Integer likeCnt;
    private Integer reportCnt;
    private Long createdId;
    private Timestamp createdDate;
    private Long updatedId;
    private Timestamp updatedDate;
    private List<RecipeStepVO> recipeSteps;
    private List<RecipeIngredientVO> recipeIngredients;
}