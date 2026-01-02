package com.cucook.moc.receipt.service;

import com.cucook.moc.receipt.dto.ReceiptOcrResponseDTO;
import com.cucook.moc.recipe.client.GeminiApiUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptOcrService {

    private final GeminiApiUtils geminiApiUtils;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReceiptOcrResponseDTO ocr(byte[] imageBytes, String mimeType) throws Exception {

        // 1️⃣ Gemini 호출
        String resultText =
                geminiApiUtils.callGeminiVisionApiForReceipt(imageBytes, mimeType);

        // 2️⃣ JSON 파싱
        JsonNode root = objectMapper.readTree(resultText);
        String ingredientsStr = root.path("ingredients").asText("");

        List<String> ingredients = Arrays.stream(ingredientsStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return ReceiptOcrResponseDTO.builder()
                .ingredients(ingredients)
                .rawText(resultText)
                .build();
    }
}
