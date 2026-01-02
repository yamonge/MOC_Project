package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStepResponseDTO {
    private Integer stepNo;    // 단계 번호
    private String stepDesc;   // 단계 설명
}