package com.cucook.moc.admin.dao;

import com.cucook.moc.admin.dto.request.AdminRecipeReportSearchRequestDTO;
import com.cucook.moc.admin.vo.AdminRecipeReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 관리자 레시피 신고 관리 DAO (tb_recipe_report)
 */
@Mapper
public interface AdminRecipeReportDAO {

    List<AdminRecipeReportVO> selectRecipeReportList(AdminRecipeReportSearchRequestDTO searchDTO);
}

