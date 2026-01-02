package com.cucook.moc.recipe.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeGenerationRequestDTO {
    private List<SelectedIngredientRequestDTO> selectedIngredients; // 사용자 선택 재료 목록 (1단계)
    private String filterCuisineCd;                                  // 필터: 요리 스타일 코드 (2단계)
    private String filterDifficultyCd;                               // 필터: 난이도 코드 (2단계)
    private String filterCookTimeCd;                                 // 필터: 조리 시간 코드 (2단계)
    private String userId; // 로그 저장을 위해 사용자 ID도 함께 받을 수 있습니다.
    private String cameraSessionId; // 카메라를 통해 재료가 입력되었다면 세션 ID
}