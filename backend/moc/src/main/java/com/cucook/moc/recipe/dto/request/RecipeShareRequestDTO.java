package com.cucook.moc.recipe.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeShareRequestDTO {
    // userId는 Controller의 @PathVariable로 받습니다.
    // private Long userId;

    private Long recipeId;    // 공유 상태를 변경할 레시피의 ID (필수)
    private boolean shareStatus; // 공유 여부 (true: 공개, false: 비공개)
}