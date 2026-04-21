package com.cucook.moc.admin.service.impl;

import com.cucook.moc.admin.dao.AdminRecipeReportDAO;
import com.cucook.moc.admin.dto.request.AdminRecipeReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeReportListItemResponseDTO;
import com.cucook.moc.admin.service.AdminRecipeReportService;
import com.cucook.moc.admin.vo.AdminRecipeReportVO;
import com.cucook.moc.recipe.dao.RecipeReportRepository;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminRecipeReportServiceImpl implements AdminRecipeReportService {

    private final RecipeReportRepository recipeReportRepository;
    private final AdminRecipeReportDAO adminRecipeReportDAO;
    private final UserRepository userRepository;

    private void requireAdminActive(Long adminUserId) {
        if (adminUserId == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 인증이 필요합니다.");
        }
        UserVO admin = userRepository.findById(adminUserId).orElse(null);
        if (admin == null || !"Y".equalsIgnoreCase(admin.getUserType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 접근할 수 있습니다.");
        }
        if (!"ACTIVE".equalsIgnoreCase(admin.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비활성 관리자 계정입니다.");
        }
    }

    @Override
    @Transactional
    public void processRecipeReport(Long recipeReportId, Long adminUserId) {
        requireAdminActive(adminUserId);
        recipeReportRepository.updateRecipeReportStatus(recipeReportId, "APPROVED");
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

        List<AdminRecipeReportVO> list = adminRecipeReportDAO.selectRecipeReportList(
                searchDTO.getReasonCd(),
                searchDTO.getStatusCd(),
                searchDTO.getKeyword(),
                searchDTO.getLastRecipeReportId(),
                searchDTO.getLimit()
        );

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
