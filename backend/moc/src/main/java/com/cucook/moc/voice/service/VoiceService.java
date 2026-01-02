package com.cucook.moc.voice.service;

import com.cucook.moc.voice.dto.RecipeSearchResponse;
import com.cucook.moc.voice.dto.VoiceRecognitionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 음성 인식 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VoiceService {
    
    @Value("${openai.api.key:}")
    private String openaiApiKey;
    
    private final RestTemplate restTemplate;
    private final YouTubeService youtubeService;
    
    /**
     * 음성 파일을 텍스트로 변환 (OpenAI Whisper API)
     * @param audioFile 음성 파일
     * @return 인식 결과
     */
    public VoiceRecognitionResponse recognizeVoice(MultipartFile audioFile) throws IOException {
        long startTime = System.currentTimeMillis();
        
        log.info("음성 인식 시작 - 파일명: {}, 크기: {} bytes", 
                 audioFile.getOriginalFilename(), audioFile.getSize());
        
        // OpenAI API 키 확인
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            log.warn("OpenAI API 키가 설정되지 않았습니다. 테스트 응답을 반환합니다.");
            return createTestResponse(startTime);
        }
        
        try {
            // 임시 파일 생성
            Path tempFile = Files.createTempFile("voice_", getFileExtension(audioFile));
            Files.copy(audioFile.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
            
            // OpenAI Whisper API 호출
            String recognizedText = callWhisperApi(tempFile.toFile());
            
            // 임시 파일 삭제
            Files.deleteIfExists(tempFile);
            
            long processingTime = System.currentTimeMillis() - startTime;
            log.info("음성 인식 완료 - 결과: {}, 처리시간: {}ms", recognizedText, processingTime);
            
            return VoiceRecognitionResponse.builder()
                    .text(recognizedText)
                    .confidence(0.95)
                    .processingTimeMs(processingTime)
                    .build();
                    
        } catch (Exception e) {
            log.error("음성 인식 실패", e);
            throw new RuntimeException("음성 인식에 실패했습니다: " + e.getMessage());
        }
    }
    
    /**
     * OpenAI Whisper API 호출
     */
    private String callWhisperApi(File audioFile) {
        String url = "https://api.openai.com/v1/audio/transcriptions";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(openaiApiKey);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new org.springframework.core.io.FileSystemResource(audioFile));
        body.add("model", "whisper-1");
        body.add("language", "ko"); // 한국어
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    url, requestEntity, (Class<Map<String, Object>>) (Class<?>) Map.class);
            Map<String, Object> responseBody = response.getBody();
            return (String) responseBody.get("text");
        } catch (Exception e) {
            log.error("OpenAI Whisper API 호출 실패", e);
            throw new RuntimeException("음성 인식 API 호출 실패: " + e.getMessage());
        }
    }
    
    /**
     * 레시피 이름으로 유튜브 쇼츠 검색
     * @param recipeName 요리명
     * @return 유튜브 쇼츠 리스트
     */
    public RecipeSearchResponse searchRecipe(String recipeName) {
        log.info("레시피 검색 - 검색어: {}", recipeName);
        
        // YouTube API를 통한 실제 검색
        RecipeSearchResponse response = youtubeService.searchRecipeShorts(recipeName);
        
        log.info("검색 완료 - 결과 수: {}", response.getTotalCount());
        return response;
    }
    
    /**
     * 파일 확장자 가져오기
     */
    private String getFileExtension(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return ".mp4";
    }
    
    /**
     * 테스트 응답 생성 (API 키 없을 때)
     */
    private VoiceRecognitionResponse createTestResponse(long startTime) {
        long processingTime = System.currentTimeMillis() - startTime;
        return VoiceRecognitionResponse.builder()
                .text("제육볶음")
                .confidence(0.85)
                .processingTimeMs(processingTime)
                .build();
    }
}
