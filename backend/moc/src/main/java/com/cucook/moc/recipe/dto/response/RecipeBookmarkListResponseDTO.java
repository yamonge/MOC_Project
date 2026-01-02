package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeBookmarkListResponseDTO {
    private List<RecipeBookmarkResponseDTO> bookmarkedRecipes;
    private int totalCount;
}