package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RecipeIngredientVO {

    private Long recipeIngredientId;    // 레시피 재료 ID (PK, Oracle 시퀀스 사용)
    private Long recipeId;              // 레시피 ID (FK to tb_recipe)
    private String ingredientName;      // 재료명 (예: 돼지고기, 양파, 간장)
    private String quantityDesc;        // 수량 설명 (예: "200g", "1개", "1/2컵")
    private String isOwnedDefault;      // 기본 보유 재료 여부 (Y/N, AI 추천 시 사용자가 보유했는지 여부)
    private Long createdId;           // 생성자 ID (String으로 변경하여 userId와 타입 일치)
    private Timestamp createdDate;      // 생성 일시 (DB 자동 입력)
    private Long updatedId;           // 최종 수정자 ID (String으로 변경하여 userId와 타입 일치)
    private Timestamp updatedDate;      // 최종 수정 일시
}