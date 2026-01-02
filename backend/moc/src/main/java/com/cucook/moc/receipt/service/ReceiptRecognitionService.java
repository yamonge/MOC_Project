package com.cucook.moc.receipt.service;

import java.util.List;

public interface ReceiptRecognitionService {

    /**
     * 영수증 이미지를 AI(Gemini)로 분석하여 재료명을 추출한 뒤,
     * 해당 재료들을 DB에 저장하고 최종 추출된 재료명 리스트를 반환합니다.
     *
     * @param imageBytes 업로드된 영수증 이미지의 바이트 배열
     * @param mimeType   이미지 MIME 타입 (image/jpeg, image/png 등)
     * @param userId     재료를 저장할 사용자 ID
     * @return AI가 인식한 재료명 리스트
     * @throws Exception AI 분석 실패 또는 DB 저장 오류 발생 시
     */
    List<String> processReceiptImageAndAddIngredients(byte[] imageBytes, String mimeType, Long userId)
            throws Exception;

}
