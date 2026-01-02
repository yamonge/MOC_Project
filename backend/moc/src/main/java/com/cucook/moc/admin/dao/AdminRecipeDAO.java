package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.dto.request.AdminRecipeSearchRequestDTO;
import com.cucook.moc.admin.vo.AdminRecipeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 관리자 레시피(게시글) 관리 DAO (tb_recipe)
 */
@Mapper
public interface AdminRecipeDAO {

    List<AdminRecipeVO> selectAdminRecipeList(AdminRecipeSearchRequestDTO searchDTO);

    int updateRecipeVisibility(
            @Param("recipeId") Long recipeId,
            @Param("isPublic") String isPublic,
            @Param("adminUserId") Long adminUserId
    );

    int softDeleteRecipe(
            @Param("recipeId") Long recipeId,
            @Param("adminUserId") Long adminUserId
    );
}
