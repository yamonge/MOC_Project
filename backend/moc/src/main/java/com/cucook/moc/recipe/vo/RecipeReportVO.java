package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_recipe_report")
public class RecipeReportVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_report_id")
    private Long reportId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private Long reporterUserId;

    @Transient
    private String reporterNickname;

    @Column(length = 20)
    private String reportReasonCd;

    @Column(length = 1000)
    private String content;

    @Column(length = 20)
    private String statusCd;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;

    private Long updatedId;

    @UpdateTimestamp
    private Timestamp updatedDate;
}
