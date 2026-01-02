package com.cucook.moc.receipt.dto;

import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ReceiptOcrResponseDTO {

    private List<String> ingredients; // ["양파", "대파"]
    private String rawText;            // Gemini 원본(JSON string)
}
