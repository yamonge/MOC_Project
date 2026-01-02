package com.cucook.moc.recipe.service;

import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import java.io.IOException;
import java.util.List;

public interface AiRecipeLogService {
    /**
     * AI 레시피 생성 로그를 저장합니다.
     *
     * @param aiRecipeLogVO 저장할 AiRecipeLogVO 객체
     * @return 삽입 성공 여부 (1 이상이면 성공)
     */
    int saveAiRecipeLog(AiRecipeLogVO aiRecipeLogVO);

    /**
     * 특정 조건에 맞는 AI 레시피 생성 로그 목록을 조회합니다.
     *
     * @param searchVO 검색 조건을 담은 AiRecipeLogVO 객체
     * @return 검색 조건에 맞는 AiRecipeLogVO 리스트
     */
    List<AiRecipeLogVO> getAiRecipeLogs(AiRecipeLogVO searchVO);


}