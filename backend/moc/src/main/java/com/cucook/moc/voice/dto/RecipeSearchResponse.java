package com.cucook.moc.voice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 레시피 검색 결과 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeSearchResponse {
    /**
     * 검색어 (요리명)
     */
    private String searchQuery;
    
    /**
     * 유튜브 쇼츠 리스트
     */
    private List<YoutubeShortInfo> shorts;
    
    /**
     * 전체 결과 개수
     */
    private Integer totalCount;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YoutubeShortInfo {
        /**
         * 유튜브 비디오 ID
         */
        private String videoId;
        
        /**
         * 비디오 제목
         */
        private String title;
        
        /**
         * 썸네일 URL
         */
        private String thumbnailUrl;
        
        /**
         * 채널명
         */
        private String channelName;
        
        /**
         * 조회수
         */
        private Long viewCount;
        
        /**
         * 업로드 날짜
         */
        private String uploadDate;
        
        /**
         * 비디오 시간 (초)
         */
        private Integer duration;
    }
}
