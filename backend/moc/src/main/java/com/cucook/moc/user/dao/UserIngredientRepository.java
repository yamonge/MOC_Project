package com.cucook.moc.user.dao;

import com.cucook.moc.user.vo.UserIngredientVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserIngredientRepository extends JpaRepository<UserIngredientVO, Long> {

    List<UserIngredientVO> findByUserId(Long userId);

    @Query("SELECT ui.userIngredientId FROM UserIngredientVO ui WHERE ui.userId = :userId AND ui.ingredientName = :ingredientName")
    Long findIdByUserIdAndIngredientName(@Param("userId") Long userId,
                                         @Param("ingredientName") String ingredientName);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserIngredientVO ui WHERE ui.userId = :userId AND ui.userIngredientId = :userIngredientId")
    void deleteByUserIdAndUserIngredientId(@Param("userId") Long userId,
                                           @Param("userIngredientId") Long userIngredientId);

    UserIngredientVO findFirstByUserIdAndIngredientNameIgnoreCase(Long userId, String ingredientName);
}
