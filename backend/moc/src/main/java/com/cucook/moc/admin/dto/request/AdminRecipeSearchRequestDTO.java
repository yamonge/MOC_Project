package com.cucook.moc.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 관리자 게시글(레시피) 검색/필터 DTO
 * - status: all | public | hidden (프론트 탭 값)
 * - search: 제목 또는 작성자 검색어
 */
@Getter
@Setter
public class AdminRecipeSearchRequestDTO {
    private String status; // all/public/hidden
    private String search; // keyword
}
