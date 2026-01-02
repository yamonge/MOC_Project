package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RecipeStepVO {

    private Long recipeStepId;      // 레시피 단계 ID (Oracle 시퀀스 사용)
    private Long recipeId;          // 레시피 ID (어떤 레시피의 단계인지 연결)
    private Integer stepNo;         // 단계 번호 (1, 2, 3...)
    private String stepDesc;        // 단계 설명
    private String imageUrl;        // 단계별 이미지 URL
    private Long createdId;       // 생성자 ID
    private Timestamp createdDate;  // 생성 일시 (DB 자동 입력)
}