package com.cucook.moc.recipe.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data // Lombok의 @Data 어노테이션으로 Getter, Setter, toString, equals, hashCode 자동 생성
public class AiRecipeLogVO {

    private Long aiRecipeLogId;         // DDL: NUMBER(19) -> VO: Long (OK)
    private Long userId;                // ⭐ 수정: String -> Long (Oracle NUMBER(19)에 맞춤)
    private String baseSourceCd;        // DDL: VARCHAR2(20) -> VO: String (OK)
    private Long cameraSessionId;       // ⭐ 수정: String -> Long (Oracle NUMBER(19)에 맞춤)
    private String manualIngredients;   // DDL: CLOB -> VO: String (OK)
    private String filterCuisineCd;     // DDL: VARCHAR2(20) -> VO: String (OK)
    private String filterDiffCd;        // DDL: VARCHAR2(20) -> VO: String (OK)
    private String filterTimeCd;        // DDL: VARCHAR2(20) -> VO: String (OK)
    private String govApiRaw;           // DDL: CLOB -> VO: String (OK)
    private String aiRequest;           // DDL: CLOB -> VO: String (OK)
    private String aiResponse;          // DDL: CLOB -> VO: String (OK)
    private Integer resultCnt;          // DDL: NUMBER(5) -> VO: Integer (OK)
    private Long createdId;             // DDL: NUMBER(19) -> VO: Long (OK)
    private Timestamp createdDate;      // DDL: TIMESTAMP(6) -> VO: Timestamp (OK)
}