package com.cucook.moc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * REST API 클라이언트 설정
 */
@Configuration
public class RestTemplateConfig {
    
    /**
     * RestTemplate 빈 등록
     * - 외부 API 호출에 사용 (OpenAI Whisper API 등)
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
