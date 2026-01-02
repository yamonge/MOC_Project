package com.cucook.moc.user.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat; // 날짜 포맷팅을 위해 추가

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientRequestDTO {
    private Long userIngredientId; // 재료 수정 시 사용 (생성 시에는 null)
    private String ingredientName;  // 재료명 (필수)
    private String quantityDesc;    // 수량 설명
    private String categoryCd;      // 카테고리 코드 (예: 육류, 채소)
    private String usedFlag;        // 사용 여부 (Y/N, 기본값은 'N'이므로 입력 없을 시 백엔드에서 처리)
    @DateTimeFormat(pattern = "yyyy-MM-dd") // 클라이언트에서 "2025-12-31" 형식으로 보낼 때 파싱
    private String memo;            // 메모
}