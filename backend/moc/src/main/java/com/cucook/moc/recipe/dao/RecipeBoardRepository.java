package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeVO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeBoardRepository extends JpaRepository<RecipeVO, Long>, RecipeBoardRepositoryCustom {
}
