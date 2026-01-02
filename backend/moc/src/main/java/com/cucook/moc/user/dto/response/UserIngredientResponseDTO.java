package com.cucook.moc.user.dto.response;

import com.cucook.moc.user.vo.UserIngredientVO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter; // 날짜 포맷팅을 위해 추가
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientResponseDTO {
    private Long userIngredientId;  // 재료 ID
    private Long userId;            // 사용자 ID
    private String ingredientName;  // 재료명
    private String quantityDesc;    // 수량 설명
    private String categoryCd;      // 카테고리 코드
    private String usedFlag;        // 사용 여부 (Y/N)
    private Timestamp expiredDate;  // 유통기한
    private String memo;            // 메모
    private boolean isExpired;      // ⭐ UI 로직용: 유통기한 만료 여부
    private boolean isNearExpiry;   // ⭐ UI 로직용: 유통기한 임박 여부 (예: 7일 이내)
    private long daysUntilExpired;  // ⭐ UI 로직용: 남은 유통기한 일수

    // UserIngredientVO를 기반으로 DTO를 생성하는 편의 메서드 (선택 사항)
    public static UserIngredientResponseDTO from(UserIngredientVO vo) {
        UserIngredientResponseDTO dto = new UserIngredientResponseDTO();
        dto.setUserIngredientId(vo.getUserIngredientId());
        dto.setUserId(vo.getUserId());
        dto.setIngredientName(vo.getIngredientName());
        dto.setQuantityDesc(vo.getQuantityDesc());
        dto.setCategoryCd(vo.getCategoryCd());
        dto.setUsedFlag(vo.getUsedFlag());
        dto.setMemo(vo.getMemo());

        return dto;
    }

}