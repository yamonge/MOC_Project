package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminRecipeDAO;
import com.cucook.moc.admin.dao.AdminUserDAO;
import com.cucook.moc.admin.dto.request.AdminRecipeSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListItemResponseDTO;
import com.cucook.moc.admin.dto.response.AdminRecipeListResponseDTO;
import com.cucook.moc.admin.vo.AdminRecipeVO;
import com.cucook.moc.admin.vo.AdminUserVO;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminRecipeServiceImpl implements AdminRecipeService {

    private final AdminRecipeDAO adminRecipeDAO;
    private final AdminUserDAO adminUserDAO;
    private final UserRepository userRepository;

    private void assertAdmin(Long adminUserId) {
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
    public AdminRecipeListResponseDTO getRecipeList(Long adminUserId, AdminRecipeSearchRequestDTO searchDTO) {
        assertAdmin(adminUserId);

        String status = null;
        String search = null;

        if (searchDTO != null && searchDTO.getStatus() != null) {
            String st = searchDTO.getStatus().trim().toLowerCase();
            if (!st.isEmpty() && !"all".equals(st)) status = st;
        }

        if (searchDTO != null && searchDTO.getSearch() != null) {
            String kw = searchDTO.getSearch().trim();
            if (!kw.isEmpty()) search = kw;
        }

        List<AdminRecipeVO> voList = adminRecipeDAO.selectAdminRecipeList(status, search);
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
