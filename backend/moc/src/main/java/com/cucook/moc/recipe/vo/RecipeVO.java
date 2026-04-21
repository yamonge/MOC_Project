package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Data
@Entity
@Table(name = "tb_recipe")
public class RecipeVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeId;

    @Column(nullable = false)
    private Long ownerUserId;

    @Column(length = 20)
    private String sourceType;

    @Column(length = 100)
    private String externalRefId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(length = 500)
    private String thumbnailUrl;

    @Column(length = 20)
    private String difficultyCd;

    private Integer cookTimeMin;

    @Column(length = 20)
    private String cuisineStyleCd;

    @Column(length = 50)
    private String category;

    @Transient
    private String authorNickname;

    @Transient
    private String authorProfileImageUrl;

    @Transient
    private Integer likedByMe;

    @Column(length = 1)
    private String isPublic;

    @Column(length = 1)
    private String isDeleted;

    private Integer viewCnt;

    private Integer likeCnt;

    private Integer reportCnt;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;

    private Long updatedId;

    @UpdateTimestamp
    private Timestamp updatedDate;

    @Transient
    private List<RecipeStepVO> recipeSteps;

    @Transient
    private List<RecipeIngredientVO> recipeIngredients;
}
