package com.cucook.moc.user.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "tb_user")
public class UserVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String userEmail;

    @Column(length = 50)
    private String userName;

    @Column(nullable = false, length = 50)
    private String userNickname;

    @Column(nullable = false, length = 255)
    private String userPassword;

    @Column(nullable = false)
    private Timestamp userBirthDate;

    @Column(length = 500)
    private String userProfileImageUrl;

    @Column(nullable = false, length = 1)
    private String userType;

    @Column(nullable = false, length = 20)
    private String userStatus;

    @Column(nullable = false)
    private Integer shoppingParticipatedCnt;

    @Column(nullable = false)
    private Integer reportedCnt;

    @Column(nullable = false)
    private Integer shoppingCompletedCnt;

    @Column
    private Double ratingScore;

    @Column
    private Double trustScore;

    @Column(length = 1000)
    private String suspendedReason;

    @Column
    private Timestamp suspendedUntil;

    @Column
    private Timestamp lastLoginDate;

    @Column(length = 50)
    private String deviceOs;

    @Column(length = 50)
    private String deviceVersion;

    @Column(length = 512)
    private String fcmToken;

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
