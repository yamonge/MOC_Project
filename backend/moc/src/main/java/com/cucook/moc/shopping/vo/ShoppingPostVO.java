package com.cucook.moc.shopping.vo;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShoppingPostVO {

    private Long shoppingPostId;

    // 작성자
    private Long writerUserId;

    // 모임 시간
    private Timestamp meetDatetime;

    // 인원 정보
    private Integer minPersonCnt;
    private Integer maxPersonCnt;
    private Integer currentPersonCnt;

    // 게시글 내용 / 상태
    private String description;
    private String statusCd;   // OPEN, CLOSED, CANCELED

    // 장소 정보 직접 저장
    private String placeName;
    private String placeAddress;
    private Double latitude;
    private Double longitude;

    // 공통 이력
    private Long createdId;
    private Timestamp createdDate;
    private Long updatedId;
    private Timestamp updatedDate;
}
