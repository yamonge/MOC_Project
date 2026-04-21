package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeReportRepository;
import com.cucook.moc.recipe.dao.RecipeRepository;
import com.cucook.moc.recipe.dto.request.RecipeReportRequestDTO;
import com.cucook.moc.recipe.dto.response.ReportedRecipeDetailDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportListResponseDTO;
import com.cucook.moc.recipe.dto.response.RecipeReportResponseDTO;
import com.cucook.moc.recipe.service.RecipeReportService;
import com.cucook.moc.recipe.vo.RecipeReportVO;
import com.cucook.moc.recipe.vo.RecipeVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeReportServiceImpl implements RecipeReportService {

    private final RecipeReportRepository recipeReportRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeReportServiceImpl(RecipeReportRepository recipeReportRepository,
                                   RecipeRepository recipeRepository) {
        this.recipeReportRepository = recipeReportRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    @Transactional
    public RecipeReportResponseDTO addRecipeReport(Long reporterUserId, RecipeReportRequestDTO requestDTO) {
        if (requestDTO.getRecipeId() == null || requestDTO.getReportReasonCd() == null || requestDTO.getReportReasonCd().isEmpty()) {
            throw new IllegalArgumentException("레시피 ID와 신고 사유 코드는 필수입니다.");
        }

        RecipeVO recipe = recipeRepository.findById(requestDTO.getRecipeId()).orElse(null);
        if (recipe == null) {
            throw new IllegalArgumentException("신고할 레시피 (ID: " + requestDTO.getRecipeId() + ")를 찾을 수 없습니다.");
        }

        RecipeReportVO vo = new RecipeReportVO();
        vo.setRecipeId(requestDTO.getRecipeId());
        vo.setReporterUserId(reporterUserId);
        vo.setReportReasonCd(requestDTO.getReportReasonCd());
        vo.setContent(requestDTO.getContent());
        vo.setStatusCd("PENDING");
        vo.setCreatedId(reporterUserId);

        RecipeReportVO saved = recipeReportRepository.save(vo);
        if (saved.getReportId() == null) {
            throw new RuntimeException("레시피 신고 저장에 실패했습니다.");
        }

        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(requestDTO.getRecipeId());
        return RecipeReportResponseDTO.from(saved, reportedRecipeDetail);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeReportListResponseDTO getReportedRecipesByReporterUserId(Long reporterUserId) {
        List<RecipeReportVO> voList = recipeReportRepository.findByReporterUserId(reporterUserId);

        List<RecipeReportResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(vo.getRecipeId());
                    return RecipeReportResponseDTO.from(vo, reportedRecipeDetail);
                })
                .collect(Collectors.toList());

        return new RecipeReportListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeReportResponseDTO getRecipeReportDetail(Long reportId, Long requestingUserId) {
        RecipeReportVO vo = recipeReportRepository.findById(reportId).orElse(null);

        if (vo == null) {
            throw new IllegalArgumentException("해당 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        if (!vo.getReporterUserId().equals(requestingUserId)) {
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 조회 권한이 없습니다.");
        }

        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(vo.getRecipeId());
        return RecipeReportResponseDTO.from(vo, reportedRecipeDetail);
    }

    @Override
    @Transactional
    public RecipeReportResponseDTO updateRecipeReport(Long reportId, Long reporterUserId, RecipeReportRequestDTO requestDTO) {
        RecipeReportVO existingVo = recipeReportRepository.findById(reportId).orElse(null);

        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        if (!existingVo.getReporterUserId().equals(reporterUserId)) {
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 수정 권한이 없습니다.");
        }

        Optional.ofNullable(requestDTO.getReportReasonCd()).filter(cd -> !cd.isEmpty()).ifPresent(existingVo::setReportReasonCd);
        Optional.ofNullable(requestDTO.getContent()).ifPresent(existingVo::setContent);
        existingVo.setUpdatedId(reporterUserId);

        recipeReportRepository.save(existingVo);

        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(existingVo.getRecipeId());
        return RecipeReportResponseDTO.from(existingVo, reportedRecipeDetail);
    }

    @Override
    @Transactional
    public boolean deleteRecipeReport(Long reportId, Long reporterUserId) {
        RecipeReportVO existingVo = recipeReportRepository.findById(reportId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }
        if (!existingVo.getReporterUserId().equals(reporterUserId)) {
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 삭제 권한이 없습니다.");
        }

        int deletedCount = recipeReportRepository.deleteByReportIdAndReporterUserId(reportId, reporterUserId);
        return deletedCount > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public int countReportedRecipesByReporterUserId(Long reporterUserId) {
        return recipeReportRepository.countByReporterUserId(reporterUserId);
    }

    private ReportedRecipeDetailDTO getReportedRecipeDetailDTO(Long recipeId) {
        RecipeVO recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe != null) {
            return new ReportedRecipeDetailDTO(recipe.getRecipeId(), recipe.getOwnerUserId(), recipe.getTitle(), recipe.getThumbnailUrl());
        }

        return new ReportedRecipeDetailDTO(recipeId, null, "알 수 없는 레시피 (ID: " + recipeId + ")", "https://default-recipe.png");
    }
}
