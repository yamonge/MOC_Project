package com.cucook.moc.user.vo;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserVO {

    // PK
    private Long userId; // NUMBER(19)

    // 로그인/계정
    private String userEmail;      // VARCHAR2(100) NOT NULL
    private String userName;       // VARCHAR2(50)
    private String userNickname;   // VARCHAR2(50) NOT NULL
    private String userPassword;   // VARCHAR2(255) NOT NULL

    // DDL: user_birth_date DATE NOT NULL
    // - 프로젝트에서 Timestamp를 쓰시겠다고 하셨으니 Timestamp로 유지합니다.
    private Timestamp userBirthDate;

    // 프로필/유형/상태
    private String userProfileImageUrl; // VARCHAR2(500)
    private String userType;            // VARCHAR2(1) DEFAULT 'N' NOT NULL
    private String userStatus;          // VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL

    // 활동/지표
    private Integer shoppingParticipatedCnt; // NUMBER DEFAULT 0 NOT NULL
    private Integer reportedCnt;             // NUMBER(10) DEFAULT 0 NOT NULL
    private Integer shoppingCompletedCnt;    // NUMBER(10) DEFAULT 0 NOT NULL
    private Double ratingScore;              // NUMBER(3,2) DEFAULT 0
    private Double trustScore;               // NUMBER(5,2) DEFAULT 0

    // 정지 정보
    private String suspendedReason;     // VARCHAR2(1000)
    private Timestamp suspendedUntil;   // TIMESTAMP(6)

    // 접속/기기
    private Timestamp lastLoginDate; // TIMESTAMP(6)
    private String deviceOs;         // VARCHAR2(50)
    private String deviceVersion;    // VARCHAR2(50)
    private String fcmToken;         // VARCHAR2(512)

    // 공통 이력
    private Long createdId;          // NUMBER(19)
    private Timestamp createdDate;   // TIMESTAMP(6) DEFAULT SYSTIMESTAMP NOT NULL
    private Long updatedId;          // NUMBER(19)
    private Timestamp updatedDate;   // TIMESTAMP(6)
}
