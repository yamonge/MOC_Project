package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_ingredient_use_hist")
public class IngredientUseHistVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ingredientUseHistId;

    @Column(nullable = false)
    private Long userId;

    private Long userIngredientId;

    private Long recipeId;

    @Column(length = 20)
    private String useTypeCd;

    @Column(length = 100)
    private String useAmountDesc;

    private Timestamp usedDate;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;
}
