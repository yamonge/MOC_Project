package com.cucook.moc.recipe.dto.response; // ⭐ recipe 패키지 아래에 dto.response를 생성

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime; // UI 표시용
import java.time.format.DateTimeFormatter; // 날짜 포맷팅용

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientUseHistResponseDTO {
    private Long ingredientUseHistId;
    private Long userId;
    private Long userIngredientId;
    private Long recipeId;
    private String useTypeCd;
    private String useAmountDesc;
    private Timestamp usedDate;
    private String usedDateFormatted;
    private Long createdId;
    private Timestamp createdDate;
    private String createdDateFormatted;

    // ⭐ IngredientUseHistVO를 기반으로 DTO를 생성하는 편의 메서드 ⭐
    public static IngredientUseHistResponseDTO from(com.cucook.moc.recipe.vo.IngredientUseHistVO vo) {
        IngredientUseHistResponseDTO dto = new IngredientUseHistResponseDTO();
        dto.setIngredientUseHistId(vo.getIngredientUseHistId());
        dto.setUserId(vo.getUserId());
        dto.setUserIngredientId(vo.getUserIngredientId());
        dto.setRecipeId(vo.getRecipeId());
        dto.setUseTypeCd(vo.getUseTypeCd());
        dto.setUseAmountDesc(vo.getUseAmountDesc());
        dto.setUsedDate(vo.getUsedDate());
        dto.setCreatedId(vo.getCreatedId());
        dto.setCreatedDate(vo.getCreatedDate());

        // 날짜 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (vo.getUsedDate() != null) {
            dto.setUsedDateFormatted(vo.getUsedDate().toLocalDateTime().format(formatter));
        }
        if (vo.getCreatedDate() != null) {
            dto.setCreatedDateFormatted(vo.getCreatedDate().toLocalDateTime().format(formatter));
        }
        return dto;
    }
}