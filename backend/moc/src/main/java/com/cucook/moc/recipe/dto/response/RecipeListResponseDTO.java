package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

// 범용적인 레시피 목록 응답 DTO (공유 레시피 목록, 게시판 목록 등에 사용)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeListResponseDTO {
    private List<RecipeResponseDTO> recipes; // 레시피 목록 (RecipeResponseDTO의 리스트)
    private int totalCount;                  // 전체 레시피 개수
}