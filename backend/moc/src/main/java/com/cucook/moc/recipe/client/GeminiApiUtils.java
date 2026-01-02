package com.cucook.moc.recipe.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiApiUtils {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=%s";

    /**
     * ============================================
     *  1) 레시피 생성 API (TEXT ONLY)
     * ============================================
     */
    public String callGeminiApi(String prompt) throws Exception {

        String url = String.format(GEMINI_API_URL, apiKey);

        // 요청 Body 구성
        Map<String, Object> textPart = Map.of(
                "text", prompt
        );

        Map<String, Object> content = Map.of(
                "parts", List.of(textPart)
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.7
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Gemini API 호출 실패: " + response.getBody());
        }

        // Gemini 응답 파싱
        JsonNode root = objectMapper.readTree(response.getBody());

        return root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }

    /**
     * ============================================
     *  2) 영수증 OCR (Vision + Image)
     * ============================================
     */
    public String callGeminiVisionApiForReceipt(byte[] imageBytes, String mimeType) throws Exception {

        String url = String.format(GEMINI_API_URL, apiKey);

        Map<String, Object> imagePart = Map.of(
                "inlineData", Map.of(
                        "mimeType", mimeType,
                        "data", java.util.Base64.getEncoder().encodeToString(imageBytes)
                )
        );

        Map<String, Object> textPart = Map.of(
                "text", RECEIPT_OCR_SYSTEM_PROMPT
        );

        Map<String, Object> content = Map.of(
                "parts", List.of(imagePart, textPart)
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Gemini Vision API 호출 실패: " + response.getBody());
        }

        JsonNode root = objectMapper.readTree(response.getBody());

        return root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }

    /**
     * ============================================
     * OCR 프롬프트 (구조화된 템플릿 방식)
     * ============================================
     */
    private static final String RECEIPT_OCR_SYSTEM_PROMPT =
            "당신은 영수증 사진에서 식재료만 정확히 골라내는 데이터 정제 전문가입니다.\n" +
                    "반드시 JSON 응답 외에 어떠한 텍스트도 출력하지 마세요.\n" +
                    "\n" +
                    "### [역할]\n" +
                    "- 제공된 이미지 내의 상품 목록을 분석하여 식재료(음식 재료)만 추출합니다.\n" +
                    "- 추출된 재료는 불필요한 정보를 제거한 후 쉼표(,)로 구분된 하나의 문자열로 정제합니다.\n" +
                    "\n" +
                    "### [추출 규칙 - 반드시 준수]\n" +
                    "1. **순수 명칭만 추출**: 브랜드명, 제조사, 수량, 무게, 가격, 단위를 모두 삭제하세요.\n" +
                    "   - 예: '서울우유 1L' -> '우유'\n" +
                    "   - 예: '국산 흙당근(봉)' -> '당근'\n" +
                    "   - 예: '필라델피아 크림치즈 200g' -> '크림치즈'\n" +
                    "2. **금지 요소**: 숫자(1, 2, 3...), 특수문자(!, @, #...), 괄호((, )), 단위를 절대 포함하지 마세요.\n" +
                    "3. **비식품 필터링**: 주방세제, 종량제 봉투, 부탄가스, 가전, 잡화 등 먹을 수 없는 항목은 리스트에서 제외하세요.\n" +
                    "4. **단어 정규화**: 구체적인 부위나 용도보다 핵심 재료명 위주로 작성하세요.\n" +
                    "   - 예: '찌개용 돼지고기 500g' -> '돼지고기'\n" +
                    "\n" +
                    "### [출력 JSON 스키마]\n" +
                    "{\n" +
                    "  \"ingredients\": \"재료1, 재료2, 재료3\"\n" +
                    "}\n" +
                    "\n" +
                    "### [최종 지시]\n" +
                    "- 이미지에서 식재료를 찾을 수 없다면 빈 값을 반환하세요: {\"ingredients\": \"\"}\n" +
                    "- ⚠️ 반드시 JSON 형식만 반환하세요. 인사말이나 부연 설명은 필요 없습니다.";
}
