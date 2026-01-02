package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportedRecipeDetailDTO {
    private Long recipeId;
    private Long ownerUserId;  // 레시피 작성자 ID
    private String title;
    private String thumbnailUrl;
    // 마이페이지 신고 내역 화면의 요구사항에 따라 필요한 다른 Recipe 정보 추가 가능
    // private String summary;
    // private String difficultyCd;
    // private Integer cookTimeMin;
}