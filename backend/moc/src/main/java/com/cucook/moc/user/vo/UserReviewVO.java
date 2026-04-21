package com.cucook.moc.user.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "tb_user_review")
public class UserReviewVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userReviewId;

    @Column(nullable = false)
    private Long targetUserId;

    @Column(nullable = false)
    private Long writerUserId;

    @Column(nullable = false)
    private Long shoppingPostId;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 1000)
    private String userReviewComment;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp createdDate;
}
