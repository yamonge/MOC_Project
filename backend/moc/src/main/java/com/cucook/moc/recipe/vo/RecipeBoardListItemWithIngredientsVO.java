package com.cucook.moc.recipe.vo;

import com.cucook.moc.recipe.dto.response.RecipeIngredientResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class RecipeBoardListItemWithIngredientsVO extends RecipeBoardListItemVO {

    // LISTAGG 문자열 파싱 결과 (최종적으로 재료 목록이 여기에 담김)
    private List<RecipeIngredientResponseDTO> ingredients;
}