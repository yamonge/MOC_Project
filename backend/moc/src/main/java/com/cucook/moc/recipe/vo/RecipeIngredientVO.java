package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_recipe_ingredient")
public class RecipeIngredientVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeIngredientId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false, length = 100)
    private String ingredientName;

    @Column(length = 100)
    private String quantityDesc;

    @Column(length = 1)
    private String isOwnedDefault;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;

    private Long updatedId;

    @UpdateTimestamp
    private Timestamp updatedDate;
}
