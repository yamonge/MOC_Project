package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_recipe_like",
       uniqueConstraints = @UniqueConstraint(columnNames = {"recipeId", "userId"}))
public class RecipeLikeVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_like_id")
    private Long likeId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private Long userId;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;
}
