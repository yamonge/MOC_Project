package com.cucook.moc.map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * 지도 API 컨트롤러
 * 네이버 개발자센터 API와 네이버 클라우드 API를 프록시
 */
@RestController
@RequestMapping("/api/map")
@CrossOrigin(origins = "*") // React Native에서 접근 허용
public class MapController {

    @Value("${naver.search.client-id}")
    private String searchClientId;

    @Value("${naver.search.client-secret}")
    private String searchClientSecret;

    @Value("${naver.cloud.client-id}")
    private String cloudClientId;

    @Value("${naver.cloud.client-secret}")
    private String cloudClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 네이버 장소 검색 API 프록시
     * @param query 검색어 (예: "천안 마트")
     * @param display 검색 결과 개수 (기본 5개)
     * @return 네이버 검색 API 응답
     */
    @GetMapping("/search")
    public ResponseEntity<String> searchPlaces(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int display
    ) {
        try {
            String url = String.format(
                    "https://openapi.naver.com/v1/search/local.json?query=%s&display=%d",
                    query, display
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Naver-Client-Id", searchClientId);
            headers.set("X-Naver-Client-Secret", searchClientSecret);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"장소 검색 실패\"}");
        }
    }

    /**
     * 네이버 클라우드 Reverse Geocoding API 프록시
     * @param coords 좌표 (경도,위도 형식, 예: "127.1472,36.8074")
     * @param orders 변환 타입 (기본 "roadaddr")
     * @param output 출력 형식 (기본 "json")
     * @return 네이버 클라우드 Reverse Geocoding API 응답
     */
    @GetMapping("/reverse-geocode")
    public ResponseEntity<String> reverseGeocode(
            @RequestParam String coords,
            @RequestParam(defaultValue = "roadaddr") String orders,
            @RequestParam(defaultValue = "json") String output
    ) {
        try {
            String url = String.format(
                    "https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=%s&orders=%s&output=%s",
                    coords, orders, output
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-ncp-apigw-api-key-id", cloudClientId);
            headers.set("x-ncp-apigw-api-key", cloudClientSecret);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"역 지오코딩 실패\"}");
        }
    }
}