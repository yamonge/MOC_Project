package com.cucook.moc.recipe.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_ai_recipe_log")
public class AiRecipeLogVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aiRecipeLogId;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 20)
    private String baseSourceCd;

    private Long cameraSessionId;

    @Lob
    private String manualIngredients;

    @Column(length = 20)
    private String filterCuisineCd;

    @Column(length = 20)
    private String filterDiffCd;

    @Column(length = 20)
    private String filterTimeCd;

    @Lob
    private String govApiRaw;

    @Lob
    private String aiRequest;

    @Lob
    private String aiResponse;

    private Integer resultCnt;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;
}
