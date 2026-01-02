package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RecipeBookmarkVO {

    private Long bookmarkId;      // DDL: recipe_bookmark_id NUMBER(19) -> Java Long
    private Long recipeId;        // DDL: recipe_id NUMBER(19)       -> Java Long
    private Long userId;          // DDL: user_id NUMBER(19)          -> Java Long
    private Long createdId;       // ⭐ DDL: created_id NUMBER(19)    -> Java Long
    private Timestamp createdDate; // ⭐ DDL: created_date TIMESTAMP(6) -> Java Timestamp
}