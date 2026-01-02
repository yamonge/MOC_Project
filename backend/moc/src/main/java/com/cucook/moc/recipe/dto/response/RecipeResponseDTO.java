package com.cucook.moc.recipe.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp; // createdDate, updatedDate 매핑용
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter; // 날짜 포맷팅용

// tb_recipe 테이블의 정보를 담는 범용적인 단일 레시피 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponseDTO {
    private Long recipeId;
    private Long ownerUserId;
    private String sourceType;
    private String externalRefId;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String difficultyCd;
    private Integer cookTimeMin;
    private String cuisineStyleCd;
    // private String category; // DB에 category 컬럼이 없으므로 DTO에서도 제거 (일관성 유지)

    private String isPublic;    // 공유 여부 (Y/N)
    private boolean isShared;   // ⭐ UI 표시용: isPublic이 'Y'인지 여부 (boolean 타입)

    private String isDeleted;
    private Integer viewCnt;
    private Integer likeCnt;
    private Integer reportCnt;
    private Long createdId;
    private Timestamp createdDate;
    private String createdDateFormatted; // UI 표시용
    private Long updatedId;
    private Timestamp updatedDate;
    private String updatedDateFormatted; // UI 표시용

    // RecipeVO를 기반으로 DTO를 생성하는 편의 메서드 (RecipeServiceImpl에서 사용)
    public static RecipeResponseDTO from(com.cucook.moc.recipe.vo.RecipeVO vo) {
        RecipeResponseDTO dto = new RecipeResponseDTO();
        dto.setRecipeId(vo.getRecipeId());
        dto.setOwnerUserId(vo.getOwnerUserId());
        dto.setSourceType(vo.getSourceType());
        dto.setExternalRefId(vo.getExternalRefId());
        dto.setTitle(vo.getTitle());
        dto.setSummary(vo.getSummary());
        dto.setThumbnailUrl(vo.getThumbnailUrl());
        dto.setDifficultyCd(vo.getDifficultyCd());
        dto.setCookTimeMin(vo.getCookTimeMin());
        dto.setCuisineStyleCd(vo.getCuisineStyleCd());
        // dto.setCategory(vo.getCategory()); // RecipeVO에서 제거했으므로 제거

        dto.setIsPublic(vo.getIsPublic());
        dto.setShared("Y".equalsIgnoreCase(vo.getIsPublic())); // ⭐ boolean 타입으로 변환

        dto.setIsDeleted(vo.getIsDeleted());
        dto.setViewCnt(vo.getViewCnt());
        dto.setLikeCnt(vo.getLikeCnt());
        dto.setReportCnt(vo.getReportCnt());
        dto.setCreatedId(vo.getCreatedId());
        dto.setCreatedDate(vo.getCreatedDate());
        dto.setUpdatedId(vo.getUpdatedId());
        dto.setUpdatedDate(vo.getUpdatedDate());

        // 날짜 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (vo.getCreatedDate() != null) {
            dto.setCreatedDateFormatted(vo.getCreatedDate().toLocalDateTime().format(formatter));
        }
        if (vo.getUpdatedDate() != null) {
            dto.setUpdatedDateFormatted(vo.getUpdatedDate().toLocalDateTime().format(formatter));
        }
        return dto;
    }
}