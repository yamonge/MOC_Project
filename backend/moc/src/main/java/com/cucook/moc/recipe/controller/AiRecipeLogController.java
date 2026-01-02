package com.cucook.moc.recipe.controller;

import com.cucook.moc.recipe.service.AiRecipeLogService;
import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI 레시피 생성 로그를 관리하는 REST 컨트롤러입니다.
 * 주로 관리자나 개발자의 디버깅 및 모니터링 목적으로 사용됩니다.
 */
@RestController
@RequestMapping("/api/v1/ai-recipe-logs")
public class AiRecipeLogController {

    private final AiRecipeLogService aiRecipeLogService;

    // 생성자 주입을 통해 AiRecipeLogService 의존성 주입
    @Autowired
    public AiRecipeLogController(AiRecipeLogService aiRecipeLogService) {
        this.aiRecipeLogService = aiRecipeLogService;
    }

    /**
     * 특정 조건에 맞는 AI 레시피 생성 로그 목록을 조회합니다.
     * HTTP GET 요청을 통해 /api/v1/ai-recipe-logs 경로로 접근하며,
     * 쿼리 파라미터로 검색 조건을 받을 수 있습니다.
     * (예: GET /api/v1/ai-recipe-logs?userId=testuser&filterCuisineCd=KOR)
     *
     * @param searchVO 검색 조건을 담은 AiRecipeLogVO 객체 (쿼리 파라미터 자동 바인딩)
     * @return 검색 조건에 맞는 AiRecipeLogVO 리스트와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<List<AiRecipeLogVO>> getAiRecipeLogs(@ModelAttribute AiRecipeLogVO searchVO) {
        List<AiRecipeLogVO> logs = aiRecipeLogService.getAiRecipeLogs(searchVO);

        if (logs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(logs, HttpStatus.OK); // 200 OK
        }
    }
}