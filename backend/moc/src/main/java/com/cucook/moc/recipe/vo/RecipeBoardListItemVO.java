package com.cucook.moc.recipe.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class RecipeBoardListItemVO {
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
    private Timestamp createdDate;

    private Long ownerUserId;
    private String authorNickname;
    private String authorProfileImageUrl;

    // 0/1
    private Integer likedByMe;
    private String ingredientsString;
}
