package com.cucook.moc.recipe.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectedIngredientRequestDTO {
    private String ingredientName; // 선택된 재료명 (예: "돼지고기", "양파")
    private String usageType;      // 사용량 타입 (예: "ALL", "PARTIAL") - 전부 사용, 일부 사용
    private String amountHint;     // 양에 대한 힌트 (예: "LITTLE", "MEDIUM", "MUCH") - 조금, 중간, 많이
}