package com.cucook.moc.recipe.dto.response; // ⭐ recipe 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeLikeListResponseDTO {
    private List<RecipeLikeResponseDTO> likedRecipes; // 좋아요된 레시피 목록
    private int totalCount;                               // 전체 좋아요 개수 (마이페이지 카드에 표시될 개수)
}