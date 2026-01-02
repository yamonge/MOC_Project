package com.cucook.moc.admin.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * PostManagementScreen 더미 데이터 구조와 동일하게 맞춤
 * - id, title, owner, date, isHidden
 */
@Getter
@Setter
public class AdminRecipeListItemResponseDTO {
    private Long id;
    private String title;
    private String owner;
    private String date;      // "yyyy.MM.dd"
    private Boolean isHidden; // true면 숨김
}
