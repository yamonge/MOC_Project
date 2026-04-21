package com.cucook.moc.user.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_user_ingredient")
public class UserIngredientVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userIngredientId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String ingredientName;

    @Column
    private String quantityDesc;

    @Column
    private String categoryCd;

    @Column(length = 1)
    private String usedFlag;

    @Column
    private String memo;

    @Column
    private Long createdId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp createdDate;

    @Column
    private Long updatedId;

    @UpdateTimestamp
    @Column
    private Timestamp updatedDate;
}
