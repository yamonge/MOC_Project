package com.cucook.moc.common.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

/**
 * 전역 예외 처리 핸들러
 * 모든 Controller에서 발생하는 예외를 자동으로 처리하여
 * 클라이언트에게 일관된 JSON 응답 형식으로 전달합니다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 400 Bad Request: 잘못된 요청
     * - 존재하지 않는 게시글
     * - 필수 파라미터 누락
     * - 유효하지 않은 입력값
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * 403 Forbidden: 권한 없음 또는 상태 오류
     * - 채팅방 참여자가 아님
     * - 모집 중이 아닌 게시글
     * - 인원이 마감된 게시글
     * - 채팅방이 존재하지 않음
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(IllegalStateException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    // ✅ 251218 yun.junseo6365 추가: ResponseStatusException은 status 그대로 내려준다
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);

        String message = e.getReason() != null ? e.getReason() : "요청 처리 중 오류가 발생했습니다.";
        response.put("message", message);

        return ResponseEntity.status(e.getStatusCode()).body(response);
    }

    /**
     * 500 Internal Server Error: 예상치 못한 서버 오류
     * - 데이터베이스 연결 실패
     * - NullPointerException
     * - 기타 런타임 예외
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleServerError(Exception e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        
        // 개발자를 위한 로그 출력 (운영 환경에서는 로거 사용 권장)
        System.err.println("[Server Error] " + e.getClass().getName() + ": " + e.getMessage());
        e.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
