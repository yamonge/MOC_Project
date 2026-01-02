package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.AiRecipeLogVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AiRecipeLogDAO {

    /**
     * AI 레시피 생성 로그를 데이터베이스에 저장합니다.
     *
     * @param vo 저장할 AiRecipeLogVO 객체
     * @return 삽입된 레코드 수
     */
    int insertAiRecipeLog(AiRecipeLogVO vo);

    /**
     * AI 레시피 생성 로그를 다양한 조건으로 검색합니다.
     *
     * @param vo 검색 조건을 담은 AiRecipeLogVO 객체
     * @return 검색 조건에 맞는 AiRecipeLogVO 리스트
     */
    List<AiRecipeLogVO> searchAiRecipeLogs(AiRecipeLogVO vo);
}