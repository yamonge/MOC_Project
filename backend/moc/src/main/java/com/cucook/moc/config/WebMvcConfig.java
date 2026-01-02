package com.cucook.moc.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Spring MVC 설정
 * 정적 리소스(업로드된 파일) 제공을 위한 핸들러 설정
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final String uploadDir;

    public WebMvcConfig(
            @Value("${file.upload.dir:#{systemProperties['user.dir']}/uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    /**
     * 정적 리소스 핸들러 추가
     * /uploads/** 경로로 요청이 오면 실제 파일 시스템의 uploads 디렉토리에서 파일 제공
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 디렉토리 경로 결정 (FileUploadUtil과 동일한 로직)
        Path uploadPath = Paths.get(uploadDir);
        if (!uploadPath.isAbsolute()) {
            uploadPath = Paths.get(System.getProperty("user.dir")).resolve(uploadDir);
        }
        
        String uploadLocation = "file:" + uploadPath.toString().replace("\\", "/") + "/";
        
        System.out.println("✅ 정적 리소스 핸들러 등록: /uploads/** -> " + uploadLocation);
        
        // 업로드된 파일 제공 (파일 시스템 경로 사용)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation)
                .setCachePeriod(3600); // 1시간 캐시
        
        // 기존 이미지 리소스도 명시적으로 추가
        registry.addResourceHandler("/image/**")
                .addResourceLocations("classpath:/static/image/");
    }
}
