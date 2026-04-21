package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.AiRecipeLogRepository;
import com.cucook.moc.recipe.service.AiRecipeLogService;
import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AiRecipeLogServiceImpl implements AiRecipeLogService {

    private final AiRecipeLogRepository aiRecipeLogRepository;

    @Autowired
    public AiRecipeLogServiceImpl(AiRecipeLogRepository aiRecipeLogRepository) {
        this.aiRecipeLogRepository = aiRecipeLogRepository;
    }

    @Override
    @Transactional
    public int saveAiRecipeLog(AiRecipeLogVO aiRecipeLogVO) {
        aiRecipeLogRepository.save(aiRecipeLogVO);
        return 1;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiRecipeLogVO> getAiRecipeLogs(AiRecipeLogVO searchVO) {
        if (searchVO != null && searchVO.getUserId() != null) {
            return aiRecipeLogRepository.findByUserId(searchVO.getUserId());
        }
        return aiRecipeLogRepository.findAll();
    }
}
