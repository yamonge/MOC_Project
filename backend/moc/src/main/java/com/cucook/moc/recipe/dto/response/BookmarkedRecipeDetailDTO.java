package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// tb_recipe 테이블의 핵심 정보를 담는 DTO (ResultMap의 association 용도)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkedRecipeDetailDTO {
    private Long recipeId;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String difficultyCd;
    private Integer cookTimeMin;
    private String cuisineStyleCd;
    // private String category;
    private Integer viewCnt;
    private Integer likeCnt;
    private String authorNickname;
}