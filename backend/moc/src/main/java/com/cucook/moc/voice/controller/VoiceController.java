package com.cucook.moc.voice.controller;

import com.cucook.moc.voice.dto.RecipeSearchResponse;
import com.cucook.moc.voice.dto.VoiceRecognitionResponse;
import com.cucook.moc.voice.service.VoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 음성 인식 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/voice")
@RequiredArgsConstructor
public class VoiceController {
    
    private final VoiceService voiceService;
    
    /**
     * 음성 파일을 텍스트로 변환
     * POST /api/v1/voice/recognize
     * 
     * @param audio 음성 파일 (MultipartFile)
     * @return 인식된 텍스트
     */
    @PostMapping("/recognize")
    public ResponseEntity<VoiceRecognitionResponse> recognizeVoice(
            @RequestParam("audio") MultipartFile audio) {
        
        log.info("음성 인식 요청 - 파일명: {}, 크기: {} bytes", 
                 audio.getOriginalFilename(), audio.getSize());
        
        // 파일 검증
        if (audio.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            VoiceRecognitionResponse response = voiceService.recognizeVoice(audio);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("음성 인식 처리 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 음성으로 레시피 검색 (유튜브 쇼츠)
     * GET /api/v1/voice/recipe?name={recipeName}
     * 
     * @param name 요리명
     * @return 유튜브 쇼츠 리스트
     */
    @GetMapping("/recipe")
    public ResponseEntity<RecipeSearchResponse> searchRecipe(
            @RequestParam("name") String name) {
        
        log.info("레시피 검색 요청 - 검색어: {}", name);
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        RecipeSearchResponse response = voiceService.searchRecipe(name);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 유튜브 쇼츠 상세 조회
     * GET /api/v1/voice/shorts/{videoId}
     * 
     * @param videoId 유튜브 비디오 ID
     * @return 유튜브 쇼츠 상세 정보
     */
    @GetMapping("/shorts/{videoId}")
    public ResponseEntity<RecipeSearchResponse.YoutubeShortInfo> getYoutubeShortDetail(
            @PathVariable("videoId") String videoId) {
        
        log.info("유튜브 쇼츠 상세 조회 - videoId: {}", videoId);
        
        // TODO: 실제 유튜브 API 연동 필요
        // 현재는 테스트 데이터 반환
        RecipeSearchResponse.YoutubeShortInfo info = RecipeSearchResponse.YoutubeShortInfo.builder()
                .videoId(videoId)
                .title("테스트 레시피 영상")
                .thumbnailUrl("https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg")
                .channelName("테스트 채널")
                .viewCount(10000L)
                .uploadDate("2024-01-01")
                .duration(60)
                .build();
        
        return ResponseEntity.ok(info);
    }
}
