package com.cucook.moc.user.dao;

import com.cucook.moc.user.vo.UserIngredientVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserIngredientDAO {

    int insertUserIngredient(UserIngredientVO vo);

    List<UserIngredientVO> selectUserIngredientsByUserId(Long userId);

    UserIngredientVO selectUserIngredientById(Long userIngredientId);

    int updateUserIngredient(UserIngredientVO vo);

    int deleteUserIngredient(Long userIngredientId);

    Long findIdByUserIdAndIngredientName(Long userId, String ingredientName);

    void deleteUserIngredientByUserAndId(Long userId, Long userIngredientId);

    /**
     * 사용자 ID와 재료명으로 기존 재료를 조회합니다 (중복 체크용).
     *
     * @param userId 사용자 ID
     * @param ingredientName 재료명
     * @return 일치하는 재료 VO 또는 null
     */
    UserIngredientVO selectByUserIdAndIngredientName(Long userId, String ingredientName);
}