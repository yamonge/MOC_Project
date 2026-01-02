package com.cucook.moc.admin.service.impl;

import com.cucook.moc.admin.dao.AdminRecipeReportDAO;
import com.cucook.moc.admin.dto.request.AdminRecipeReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeReportListItemResponseDTO;
import com.cucook.moc.admin.service.AdminRecipeReportService;
import com.cucook.moc.admin.vo.AdminRecipeReportVO;
import com.cucook.moc.recipe.dao.RecipeReportDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminRecipeReportServiceImpl implements AdminRecipeReportService {

    private final RecipeReportDAO recipeReportDAO;
    private final AdminRecipeReportDAO adminRecipeReportDAO;

    @Override
    @Transactional
    public void processRecipeReport(Long recipeReportId, Long adminUserId) {
        recipeReportDAO.updateRecipeReportStatus(recipeReportId, "APPROVED");
    }

    @Override
    public List<AdminRecipeReportListItemResponseDTO> getRecipeReportList(AdminRecipeReportSearchRequestDTO searchDTO) {
        if (searchDTO == null) {
            searchDTO = new AdminRecipeReportSearchRequestDTO();
        }

        if (searchDTO.getStatusCd() == null || searchDTO.getStatusCd().trim().isEmpty()) {
            searchDTO.setStatusCd("ALL");
        }
        if (searchDTO.getLimit() == null || searchDTO.getLimit() <= 0) {
            searchDTO.setLimit(50);
        }

        List<AdminRecipeReportVO> list = adminRecipeReportDAO.selectRecipeReportList(searchDTO);

        List<AdminRecipeReportListItemResponseDTO> result = new ArrayList<>();
        if (list == null) return result;

        for (AdminRecipeReportVO vo : list) {
            AdminRecipeReportListItemResponseDTO dto = AdminRecipeReportListItemResponseDTO.builder()
                    .recipeReportId(vo.getRecipeReportId())
                    .recipeId(vo.getRecipeId())
                    .reportReasonCd(vo.getReportReasonCd())
                    .statusCd(vo.getStatusCd())
                    .createdDate(vo.getCreatedDate())
                    .reporterUserId(vo.getReporterUserId())
                    .reporterNickname(vo.getReporterNickname())
                    .recipeTitle(vo.getRecipeTitle())
                    .recipeOwnerUserId(vo.getRecipeOwnerUserId())
                    .recipeOwnerNickname(vo.getRecipeOwnerNickname())
                    .content(vo.getContent())
                    .build();
            result.add(dto);
        }

        return result;
    }
}
