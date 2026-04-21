package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiRecipeLogRepository extends JpaRepository<AiRecipeLogVO, Long> {

    List<AiRecipeLogVO> findByUserId(Long userId);
}
