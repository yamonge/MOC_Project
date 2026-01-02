package com.cucook.moc.recipe.dto.request; // ⭐ recipe 패키지

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeLikeRequestDTO {
    private Long recipeId; // ⭐ 좋아요/취소할 레시피의 ID (필수)
}