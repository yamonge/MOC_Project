package com.cucook.moc.shopping.dto;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShoppingPostSummaryDTO {

    private Long shoppingPostId;

    // 장소
    private String placeName;
    private String placeAddress;
    private Double latitude;
    private Double longitude;

    // 시간/인원/상태
    private Timestamp meetDatetime;
    private Integer maxPersonCnt;
    private Integer currentPersonCnt;
    private String statusCd;

    // 작성자
    private Long writerUserId;
    private String writerNickname;

    // 목록(카드)에 유용한 값들
    private Timestamp createdDate;
    private String description;

    // ✅ 카테고리 요약(콤마 문자열) - LISTAGG로 내려줌
    private String categoryCodesCsv;

    // ✅ (nearby에서만 의미있게 사용 가능) 거리(m)
    private Double distanceMeters;
    
    // ✅ 현재 사용자가 참여 중인지 여부
    private Boolean isParticipated;
}
