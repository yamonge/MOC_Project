package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_recipe_step")
public class RecipeStepVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeStepId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private Integer stepNo;

    @Column(length = 2000)
    private String stepDesc;

    @Column(length = 500)
    private String imageUrl;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;
}
