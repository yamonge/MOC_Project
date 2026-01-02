package com.cucook.moc.admin.dto.response;

import lombok.*;
import java.sql.Timestamp;

/**
 * 레시피 신고 목록 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminRecipeReportListItemResponseDTO {

    private Long recipeReportId;
    private Long recipeId;
    private String reportReasonCd;
    private String statusCd;
    private Timestamp createdDate;

    private Long reporterUserId;
    private String reporterNickname;

    private String recipeTitle;
    private Long recipeOwnerUserId;
    private String recipeOwnerNickname;

    private String content;
}

