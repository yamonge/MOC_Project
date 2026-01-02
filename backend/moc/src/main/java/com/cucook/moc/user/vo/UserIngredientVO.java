package com.cucook.moc.user.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserIngredientVO {
    private Long userIngredientId;
    private Long userId;
    private String ingredientName;
    private String quantityDesc;
    private String categoryCd;
    private String usedFlag;
    private String memo;
    private Long createdId;
    private Timestamp createdDate;
    private Long updatedId;
    private Timestamp updatedDate;
}