package com.cucook.moc.shopping.dto;

import lombok.*;

import java.util.List;

/**
 * 같이 장보기 게시글 생성 요청 DTO
 * - meetDateTime: 클라이언트에서 epoch millis(숫자)로 전달 (예: 1765212600000)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShoppingPostCreateRequestDTO {

    // 장소 정보
    private String placeName;
    private String placeAddress;
    private Double latitude;
    private Double longitude;

    // 모집 정보
    private Long meetDateTime;        // ✅ epoch millis
    private Integer minPersonCnt;     // 없으면 기본 2
    private Integer maxPersonCnt;     // 2~5
    private String description;

    // 재료(카테고리) 코드들: 프론트 ingredient id(meat, dairy …) 그대로
    private List<String> categoryCodes;
}
