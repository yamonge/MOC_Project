package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredientResponseDTO {
    private String ingredientName; // 재료명
    private String quantityDesc;   // 수량 설명 (예: "200g", "1개")
    private boolean isOwned;       // 사용자가 이 재료를 가지고 있는지 여부 (true/false)
    // 워크플로우의 '보유 재료 / 부족한 재료' 표시를 위해 추가
}