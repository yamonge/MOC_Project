package com.cucook.moc.shopping.dto;

import lombok.*;

import java.sql.Timestamp;
import java.util.List;

// 게시글 상세보기
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShoppingPostDetailDTO {

    private Long shoppingPostId;

    // 작성자
    private Long writerUserId;
    private String writerNickname;

    // 장소
    private String placeName;
    private String placeAddress;
    private Double latitude;
    private Double longitude;

    // 시간/인원/상태
    private Timestamp meetDatetime;
    private Integer minPersonCnt;
    private Integer maxPersonCnt;
    private Integer currentPersonCnt;
    private String statusCd;

    // 내용
    private String description;

    // 카테고리 목록
    private List<String> categoryCodes;
}
