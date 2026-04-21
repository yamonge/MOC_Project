package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RecipeRepository extends JpaRepository<RecipeVO, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE RecipeVO r SET r.likeCnt = r.likeCnt + 1 WHERE r.recipeId = :recipeId")
    int incrementRecipeLikeCount(@Param("recipeId") Long recipeId);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeVO r SET r.likeCnt = CASE WHEN r.likeCnt > 0 THEN r.likeCnt - 1 ELSE 0 END WHERE r.recipeId = :recipeId")
    int decrementRecipeLikeCount(@Param("recipeId") Long recipeId);

    @Modifying
    @Transactional
    @Query("UPDATE RecipeVO r SET r.isPublic = :isPublicFlag WHERE r.recipeId = :recipeId AND r.ownerUserId = :userId")
    int updateRecipeIsPublic(@Param("recipeId") Long recipeId,
                             @Param("userId") Long userId,
                             @Param("isPublicFlag") String isPublicFlag);

    List<RecipeVO> findByOwnerUserIdAndIsPublic(Long ownerUserId, String isPublic);

    int countByOwnerUserIdAndIsPublic(Long ownerUserId, String isPublic);
}
