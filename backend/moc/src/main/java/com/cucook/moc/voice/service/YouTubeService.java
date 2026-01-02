package com.cucook.moc.voice.service;

import com.cucook.moc.voice.dto.RecipeSearchResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * YouTube Data API v3 서비스
 * 유튜브 쇼츠 검색 및 정보 조회
 */
@Slf4j
@Service
public class YouTubeService {
    
    @Value("${youtube.api.key}")
    private String youtubeApiKey;
    
    private static final String APPLICATION_NAME = "MOC Recipe Search";
    
    /**
     * 레시피 이름으로 유튜브 쇼츠 검색
     * @param recipeName 레시피 이름
     * @return 유튜브 쇼츠 리스트
     */
    public RecipeSearchResponse searchRecipeShorts(String recipeName) {
        try {
            YouTube youtube = new YouTube.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance(),
                request -> {}
            ).setApplicationName(APPLICATION_NAME).build();
            
            // 1단계: 검색 API로 비디오 ID 목록 가져오기
            List<String> videoIds = searchVideoIds(youtube, recipeName);
            
            if (videoIds.isEmpty()) {
                log.warn("검색 결과가 없습니다: {}", recipeName);
                return createEmptyResponse(recipeName);
            }
            
            // 2단계: Videos API로 상세 정보 가져오기
            List<RecipeSearchResponse.YoutubeShortInfo> shorts = getVideoDetails(youtube, videoIds, recipeName);
            
            return RecipeSearchResponse.builder()
                    .searchQuery(recipeName)
                    .shorts(shorts)
                    .totalCount(shorts.size())
                    .build();
                    
        } catch (Exception e) {
            log.error("유튜브 검색 실패: {}", recipeName, e);
            return createEmptyResponse(recipeName);
        }
    }
    
    /**
     * 검색 API로 비디오 ID 목록 가져오기
     */
    private List<String> searchVideoIds(YouTube youtube, String recipeName) {
        try {
            String searchQuery = recipeName + " 레시피";
            
            log.info("YouTube 검색 API 호출: {}", searchQuery);
            
            YouTube.Search.List search = youtube.search()
                    .list(List.of("snippet"))
                    .setQ(searchQuery)
                    .setType(List.of("video"))
                    .setOrder("relevance")
                    .setMaxResults(25L)
                    .setKey(youtubeApiKey);
            
            SearchListResponse response = search.execute();
            
            List<String> videoIds = response.getItems().stream()
                    .map(item -> item.getId().getVideoId())
                    .collect(Collectors.toList());
            
            log.info("검색된 비디오 수: {}", videoIds.size());
            return videoIds;
            
        } catch (Exception e) {
            log.error("YouTube 검색 API 호출 실패", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Videos API로 비디오 상세 정보 가져오기
     */
    private List<RecipeSearchResponse.YoutubeShortInfo> getVideoDetails(
            YouTube youtube, List<String> videoIds, String recipeName) {
        try {
            String videoIdsParam = String.join(",", videoIds);
            
            log.info("YouTube Videos API 호출: {} 개", videoIds.size());
            
            YouTube.Videos.List videoRequest = youtube.videos()
                    .list(List.of("snippet", "contentDetails", "statistics"))
                    .setId(List.of(videoIdsParam))
                    .setKey(youtubeApiKey);
            
            VideoListResponse response = videoRequest.execute();
            
            List<RecipeSearchResponse.YoutubeShortInfo> shorts = new ArrayList<>();
            
            log.info("Videos API 응답 아이템 수: {}", response.getItems().size());
            
            for (Video video : response.getItems()) {
                try {
                    RecipeSearchResponse.YoutubeShortInfo shortInfo = parseVideo(video);
                    
                    log.info("영상 정보: 제목={}, 시간={}초", shortInfo.getTitle(), shortInfo.getDuration());
                    
                    // 1. 짧은 영상 판별: 240초(4분) 이하
                    if (shortInfo.getDuration() > 240) {
                        log.info("❌ 240초 초과: {} ({}초)", shortInfo.getTitle(), shortInfo.getDuration());
                        continue;
                    }
                    
                    // 2. 제목 검증
                    String title = shortInfo.getTitle().toLowerCase();
                    String recipeNameLower = recipeName.toLowerCase();
                    
                    // 한글 포함 여부 체크
                    if (!shortInfo.getTitle().matches(".*[가-힣]+.*")) {
                        log.info("❌ 한국어 미포함: {}", shortInfo.getTitle());
                        continue;
                    }
                    
                    // 요리명 매칭
                    if (!title.contains(recipeNameLower)) {
                        log.info("❌ 요리명 미포함: {} (검색어: {})", shortInfo.getTitle(), recipeName);
                        continue;
                    }
                    
                    shorts.add(shortInfo);
                    log.info("✅ 선택된 영상: {} ({}초)", shortInfo.getTitle(), shortInfo.getDuration());
                    
                    if (shorts.size() >= 10) {
                        break;
                    }
                } catch (Exception e) {
                    log.error("비디오 파싱 실패", e);
                }
            }
            
            log.info("파싱된 비디오 수: {}", shorts.size());
            return shorts;
            
        } catch (Exception e) {
            log.error("YouTube Videos API 호출 실패", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * 비디오 파싱
     */
    private RecipeSearchResponse.YoutubeShortInfo parseVideo(Video video) {
        String videoId = video.getId();
        
        // 썸네일 URL (고해상도 우선)
        String thumbnailUrl = video.getSnippet().getThumbnails().getMaxres() != null
                ? video.getSnippet().getThumbnails().getMaxres().getUrl()
                : video.getSnippet().getThumbnails().getHigh() != null
                ? video.getSnippet().getThumbnails().getHigh().getUrl()
                : video.getSnippet().getThumbnails().getMedium().getUrl();
        
        // Duration 파싱
        String durationStr = video.getContentDetails().getDuration();
        int duration = parseDuration(durationStr);
        
        // 조회수
        long viewCount = video.getStatistics().getViewCount() != null
                ? video.getStatistics().getViewCount().longValue()
                : 0L;
        
        return RecipeSearchResponse.YoutubeShortInfo.builder()
                .videoId(videoId)
                .title(video.getSnippet().getTitle())
                .thumbnailUrl(thumbnailUrl)
                .channelName(video.getSnippet().getChannelTitle())
                .viewCount(viewCount)
                .uploadDate(video.getSnippet().getPublishedAt().toString().substring(0, 10))
                .duration(duration)
                .build();
    }
    
    /**
     * ISO 8601 Duration 파싱 (PT1M30S → 90초)
     */
    private int parseDuration(String durationStr) {
        try {
            Duration duration = Duration.parse(durationStr);
            return (int) duration.getSeconds();
        } catch (Exception e) {
            log.error("Duration 파싱 실패: {}", durationStr, e);
            return 60;
        }
    }
    
    /**
     * 빈 응답 생성
     */
    private RecipeSearchResponse createEmptyResponse(String recipeName) {
        return RecipeSearchResponse.builder()
                .searchQuery(recipeName)
                .shorts(new ArrayList<>())
                .totalCount(0)
                .build();
    }
}
