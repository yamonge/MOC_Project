package com.cucook.moc.receipt.controller;

import com.cucook.moc.receipt.dto.ReceiptOcrResponseDTO;
import com.cucook.moc.receipt.service.ReceiptOcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/receipt")
@RequiredArgsConstructor
public class ReceiptOcrController {

    private final ReceiptOcrService receiptOcrService;

    @PostMapping(
            value = "/ocr",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ReceiptOcrResponseDTO> ocr(
            @RequestPart("file") MultipartFile file
    ) throws Exception {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ReceiptOcrResponseDTO result =
                receiptOcrService.ocr(file.getBytes(), file.getContentType());

        return ResponseEntity.ok(result);
    }
}
