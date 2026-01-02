package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class IngredientUseHistVO {

    private Long ingredientUseHistId;   // DDL: ingredient_use_hist_id NUMBER(19) -> Java Long
    private Long userId;                // DDL: user_id NUMBER(19)          -> Java Long
    private Long userIngredientId;      // DDL: user_ingredient_id NUMBER(19) -> Java Long
    private Long recipeId;              // DDL: recipe_id NUMBER(19)       -> Java Long (NULL 허용)
    private String useTypeCd;           // DDL: use_type_cd VARCHAR2(20)    -> Java String
    private String useAmountDesc;       // DDL: use_amount_desc VARCHAR2(100) -> Java String
    private Timestamp usedDate;         // DDL: used_date TIMESTAMP(6)     -> Java Timestamp
    private Long createdId;             // DDL: created_id NUMBER(19)       -> Java Long
    private Timestamp createdDate;      // DDL: created_date TIMESTAMP(6)   -> Java Timestamp
}