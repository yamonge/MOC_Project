package com.cucook.moc.receipt.controller;

import com.cucook.moc.receipt.service.ReceiptRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/receipt")
public class ReceiptRecognitionController {

    private final ReceiptRecognitionService receiptRecognitionService;

    @Autowired
    public ReceiptRecognitionController(ReceiptRecognitionService receiptRecognitionService) {
        this.receiptRecognitionService = receiptRecognitionService;
    }

    /**
     * 영수증 이미지 업로드 및 재료 자동 추출 API
     *
     * @param file 업로드된 이미지 파일
     * @param userId 재료가 저장될 사용자 ID
     * @return 재료명 리스트
     */
    @PostMapping(value = "/recognize", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> recognizeReceipt(
            @RequestPart("file") MultipartFile file,
            @RequestParam("userId") Long userId
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("업로드된 파일이 없습니다.");
            }

            // MIME 타입 자동 감지
            String mimeType = file.getContentType();
            if (mimeType == null || !mimeType.startsWith("image")) {
                return ResponseEntity.badRequest().body("이미지 파일만 업로드 가능합니다.");
            }

            byte[] imageBytes = file.getBytes();

            // ReceiptRecognitionService를 호출하여 재료 추출 + DB 저장
            List<String> ingredients = receiptRecognitionService
                    .processReceiptImageAndAddIngredients(imageBytes, mimeType, userId);

            return ResponseEntity.ok(ingredients);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("영수증 분석 중 오류 발생: " + e.getMessage());
        }
    }
}
