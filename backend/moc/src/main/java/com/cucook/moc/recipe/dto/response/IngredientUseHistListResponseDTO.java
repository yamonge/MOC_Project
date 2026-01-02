package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientUseHistListResponseDTO {
    private List<IngredientUseHistResponseDTO> useHists;
    private int totalCount;
    // 추가적으로 페이징 정보 등을 포함할 수 있습니다.
}