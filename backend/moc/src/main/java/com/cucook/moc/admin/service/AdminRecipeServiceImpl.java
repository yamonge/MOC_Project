package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminRecipeDAO;
import com.cucook.moc.admin.dao.AdminUserDAO;
import com.cucook.moc.admin.dto.request.AdminRecipeSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListItemResponseDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListResponseDTO;
import com.cucook.moc.admin.vo.AdminRecipeVO;
import com.cucook.moc.admin.vo.AdminUserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * 관리자 레시피(게시글) 관리 비즈니스 로직 구현체
 */
@Service
@RequiredArgsConstructor
public class AdminRecipeServiceImpl implements AdminRecipeService {

    private final AdminRecipeDAO adminRecipeDAO;
    private final AdminUserDAO adminUserDAO;

    private void assertAdmin(Long adminUserId) {
        AdminUserVO admin = adminUserDAO.selectAdminUserById(adminUserId);
        if (admin == null || !"Y".equals(admin.getUserType())) {
            throw new IllegalArgumentException("관리자 권한이 없습니다.");
        }
    }

    @Override
    public AdminRecipeListResponseDTO getRecipeList(Long adminUserId, AdminRecipeSearchRequestDTO searchDTO) {
        assertAdmin(adminUserId);

        // status 정규화: all -> null 처리(쿼리에서 조건 제외)
        if (searchDTO != null && searchDTO.getStatus() != null) {
            String st = searchDTO.getStatus().trim().toLowerCase();
            if (st.isEmpty() || "all".equals(st)) searchDTO.setStatus(null);
            else searchDTO.setStatus(st);
        }

        // search trim
        if (searchDTO != null && searchDTO.getSearch() != null) {
            String kw = searchDTO.getSearch().trim();
            searchDTO.setSearch(kw.isEmpty() ? null : kw);
        }

        List<AdminRecipeVO> voList = adminRecipeDAO.selectAdminRecipeList(searchDTO);
        List<AdminRecipeListItemResponseDTO> posts = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd");

        for (AdminRecipeVO vo : voList) {
            AdminRecipeListItemResponseDTO dto = new AdminRecipeListItemResponseDTO();
            dto.setId(vo.getRecipeId());
            dto.setTitle(vo.getTitle());
            dto.setOwner(vo.getOwnerNickname());
            dto.setIsHidden("N".equals(vo.getIsPublic()));

            if (vo.getCreatedDate() != null) dto.setDate(sdf.format(vo.getCreatedDate()));
            else dto.setDate(null);

            posts.add(dto);
        }

        return new AdminRecipeListResponseDTO(true, posts);
    }

    @Override
    @Transactional
    public void hideRecipe(Long adminUserId, Long recipeId) {
        assertAdmin(adminUserId);

        int updated = adminRecipeDAO.updateRecipeVisibility(recipeId, "N", adminUserId);
        if (updated == 0) throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
    }

    @Override
    @Transactional
    public void showRecipe(Long adminUserId, Long recipeId) {
        assertAdmin(adminUserId);

        int updated = adminRecipeDAO.updateRecipeVisibility(recipeId, "Y", adminUserId);
        if (updated == 0) throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
    }

    @Override
    @Transactional
    public void deleteRecipe(Long adminUserId, Long recipeId) {
        assertAdmin(adminUserId);

        int updated = adminRecipeDAO.softDeleteRecipe(recipeId, adminUserId);
        if (updated == 0) throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
    }
}
