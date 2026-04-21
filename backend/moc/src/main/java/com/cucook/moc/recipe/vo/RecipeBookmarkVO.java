package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_recipe_bookmark")
public class RecipeBookmarkVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_bookmark_id")
    private Long bookmarkId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private Long userId;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;
}
