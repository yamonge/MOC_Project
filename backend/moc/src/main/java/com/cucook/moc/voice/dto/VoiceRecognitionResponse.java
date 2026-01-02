package com.cucook.moc.voice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 음성 인식 결과 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceRecognitionResponse {
    /**
     * 인식된 텍스트 (요리명)
     */
    private String text;
    
    /**
     * 신뢰도 (0.0 ~ 1.0)
     */
    private Double confidence;
    
    /**
     * 처리 시간 (ms)
     */
    private Long processingTimeMs;
}
