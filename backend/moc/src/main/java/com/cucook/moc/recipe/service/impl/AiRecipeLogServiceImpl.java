package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.AiRecipeLogDAO;
import com.cucook.moc.recipe.service.AiRecipeLogService;
import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AiRecipeLogServiceImpl implements AiRecipeLogService {

    private final AiRecipeLogDAO aiRecipeLogDAO;

    @Autowired
    public AiRecipeLogServiceImpl(AiRecipeLogDAO aiRecipeLogDAO) {
        this.aiRecipeLogDAO = aiRecipeLogDAO;
    }

    /**
     * AI 레시피 생성 로그 저장
     */
    @Override
    @Transactional
    public int saveAiRecipeLog(AiRecipeLogVO aiRecipeLogVO) {
        return aiRecipeLogDAO.insertAiRecipeLog(aiRecipeLogVO);
    }

    /**
     * AI 레시피 생성 로그 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<AiRecipeLogVO> getAiRecipeLogs(AiRecipeLogVO searchVO) {
        return aiRecipeLogDAO.searchAiRecipeLogs(searchVO);
    }
}
