package com.cucook.moc.recipe.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeBookmarkRequestDTO {
    private Long recipeId;
}