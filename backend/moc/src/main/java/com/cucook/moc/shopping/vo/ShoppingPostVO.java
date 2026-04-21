package com.cucook.moc.shopping.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "tb_shopping_post")
public class ShoppingPostVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shoppingPostId;

    private Long writerUserId;

    private Timestamp meetDatetime;

    private Integer minPersonCnt;
    private Integer maxPersonCnt;
    private Integer currentPersonCnt;

    private String description;

    @Column(length = 20)
    private String statusCd;

    private String placeName;
    private String placeAddress;
    private Double latitude;
    private Double longitude;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;

    private Long updatedId;

    @UpdateTimestamp
    private Timestamp updatedDate;
}
