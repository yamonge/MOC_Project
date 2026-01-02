package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.dao.RecipeDAO;
import com.cucook.moc.recipe.dao.RecipeReportDAO;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Spring 서비스 컴포넌트로 등록
public class RecipeReportServiceImpl implements RecipeReportService {

    private final RecipeReportDAO recipeReportDAO;
    private final RecipeDAO recipeDAO; // 신고된 레시피 정보 조회를 위해 주입

    @Autowired // 생성자 주입
    public RecipeReportServiceImpl(RecipeReportDAO recipeReportDAO,
                                   RecipeDAO recipeDAO) {
        this.recipeReportDAO = recipeReportDAO;
        this.recipeDAO = recipeDAO;
    }

    /**
     * 레시피를 신고합니다.
     *
     * @param reporterUserId 신고하는 사용자의 ID
     * @param requestDTO 신고 정보를 담은 요청 DTO (recipeId, reportReasonCd, content 포함)
     * @return 작성된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락, 이미 신고한 경우 등
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public RecipeReportResponseDTO addRecipeReport(Long reporterUserId, RecipeReportRequestDTO requestDTO) {
        // 필수 필드 유효성 검사
        if (requestDTO.getRecipeId() == null || requestDTO.getReportReasonCd() == null || requestDTO.getReportReasonCd().isEmpty()) {
            throw new IllegalArgumentException("레시피 ID와 신고 사유 코드는 필수입니다.");
        }

        // 1. 레시피 존재 여부 확인 (tb_recipe 테이블에서)
        RecipeVO recipe = recipeDAO.selectRecipeById(requestDTO.getRecipeId());
        if (recipe == null) {
            throw new IllegalArgumentException("신고할 레시피 (ID: " + requestDTO.getRecipeId() + ")를 찾을 수 없습니다.");
        }

        // 2. 중복 신고 허용 (제한 제거)
        // if (recipeReportDAO.checkIfRecipeReportExists(requestDTO.getRecipeId(), reporterUserId) > 0) {
        //     throw new IllegalArgumentException("이미 해당 레시피 (ID: " + requestDTO.getRecipeId() + ")를 신고했습니다.");
        // }

        // 3. Request DTO -> VO 변환 및 설정
        RecipeReportVO vo = new RecipeReportVO();
        vo.setRecipeId(requestDTO.getRecipeId());
        vo.setReporterUserId(reporterUserId); // 신고하는 사용자 ID 설정
        vo.setReportReasonCd(requestDTO.getReportReasonCd());
        vo.setContent(requestDTO.getContent());
        vo.setStatusCd("PENDING"); // 초기 상태는 'PENDING'으로 설정
        vo.setCreatedId(reporterUserId); // 생성자 ID를 신고자 ID로 설정
        // createdDate, updatedDate는 DB default 값에 맡김

        // 4. DB에 저장
        int insertedCount = recipeReportDAO.insertRecipeReport(vo);
        if (insertedCount == 0 || vo.getReportId() == null) {
            throw new RuntimeException("레시피 신고 저장에 실패했습니다.");
        }

        // 5. 저장된 정보를 기반으로 Response DTO 생성 및 반환
        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(requestDTO.getRecipeId()); // 신고된 레시피 정보 조회
        return RecipeReportResponseDTO.from(vo, reportedRecipeDetail); // 편의 메서드 사용
    }

    /**
     * 특정 사용자가 '신고한' 모든 레시피 신고 목록을 조회합니다.
     * 마이페이지 '신고 내역' 탭의 레시피 신고 목록 표시용입니다.
     *
     * @param reporterUserId 신고 목록을 조회할 사용자의 ID
     * @return 사용자가 신고한 레시피 신고 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public RecipeReportListResponseDTO getReportedRecipesByReporterUserId(Long reporterUserId) {
        List<RecipeReportVO> voList = recipeReportDAO.selectReportedRecipesByReporterUserId(reporterUserId);

        // VO 리스트 -> DTO 리스트 변환 (신고된 레시피 상세 정보 포함)
        List<RecipeReportResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(vo.getRecipeId()); // 각 신고된 레시피 정보 조회
                    return RecipeReportResponseDTO.from(vo, reportedRecipeDetail);
                })
                .collect(Collectors.toList());

        return new RecipeReportListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 레시피 신고 ID로 단일 신고 정보를 조회합니다.
     * (관리자/개발자용 또는 신고 수정/삭제 전 존재 여부 확인용)
     *
     * @param reportId 조회할 신고 ID
     * @param requestingUserId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @return 상세 레시피 신고 정보를 담은 응답 DTO 또는 null (해당 신고가 없을 경우)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional(readOnly = true)
    public RecipeReportResponseDTO getRecipeReportDetail(Long reportId, Long requestingUserId) {
        RecipeReportVO vo = recipeReportDAO.selectRecipeReportById(reportId);

        // 신고 존재 여부 확인
        if (vo == null) {
            throw new IllegalArgumentException("해당 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        // 권한 확인: 신고한 사용자(reporter) 본인 또는 관리자만 조회 가능
        if (!vo.getReporterUserId().equals(requestingUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 조회 권한이 없습니다.");
        }

        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(vo.getRecipeId()); // 신고된 레시피 정보 조회
        return RecipeReportResponseDTO.from(vo, reportedRecipeDetail);
    }

    /**
     * 특정 레시피 신고 정보를 수정합니다. (신고 내용/사유만 수정 가능하도록)
     *
     * @param reportId 수정할 신고 ID
     * @param reporterUserId 신고 작성자의 ID (권한 확인용)
     * @param requestDTO 수정할 신고 정보를 담은 요청 DTO (reportReasonCd, content 포함)
     * @return 수정된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public RecipeReportResponseDTO updateRecipeReport(Long reportId, Long reporterUserId, RecipeReportRequestDTO requestDTO) {
        RecipeReportVO existingVo = recipeReportDAO.selectRecipeReportById(reportId);

        // 신고 존재 여부 확인
        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        // 권한 확인: 신고한 사용자 본인만 수정 가능 (관리자도 가능하도록 확장 가능)
        if (!existingVo.getReporterUserId().equals(reporterUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 수정 권한이 없습니다.");
        }

        // DTO -> VO 업데이트
        // 관리자 처리 상태(statusCd)는 여기서 수정하지 않음 (별도 관리자 API에서 처리)
        // 레시피 ID, 신고자 ID 등은 불변 필드
        Optional.ofNullable(requestDTO.getReportReasonCd()).filter(cd -> !cd.isEmpty()).ifPresent(existingVo::setReportReasonCd);
        Optional.ofNullable(requestDTO.getContent()).ifPresent(existingVo::setContent);
        existingVo.setUpdatedId(reporterUserId); // 수정자 ID 설정
        // updatedDate는 DB default 값에 맡김

        int updatedCount = recipeReportDAO.updateRecipeReport(existingVo);
        if (updatedCount == 0) {
            throw new RuntimeException("레시피 신고 정보 수정에 실패했습니다.");
        }

        ReportedRecipeDetailDTO reportedRecipeDetail = getReportedRecipeDetailDTO(existingVo.getRecipeId()); // 신고된 레시피 정보 조회
        return RecipeReportResponseDTO.from(existingVo, reportedRecipeDetail);
    }

    /**
     * 특정 레시피 신고 기록을 삭제합니다.
     *
     * @param reportId 삭제할 신고 ID
     * @param reporterUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public boolean deleteRecipeReport(Long reportId, Long reporterUserId) {
        // 1. 삭제 전 권한 확인
        RecipeReportVO existingVo = recipeReportDAO.selectRecipeReportById(reportId);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 레시피 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }
        // 권한 확인: 신고한 사용자 본인만 삭제 가능 (관리자도 가능하도록 확장 가능)
        if (!existingVo.getReporterUserId().equals(reporterUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 레시피 신고 (ID: " + reportId + ")에 대한 삭제 권한이 없습니다.");
        }

        // 2. DB에서 삭제
        int deletedCount = recipeReportDAO.deleteRecipeReport(reportId, reporterUserId); // DAO 메서드에 reporterUserId도 전달
        return deletedCount > 0;
    }

    /**
     * 특정 사용자가 '신고한' 레시피 신고의 총 개수를 조회합니다.
     * 마이페이지 '신고 내역' 카드에 표시용입니다.
     *
     * @param reporterUserId 개수를 조회할 사용자의 ID
     * @return 신고된 레시피 신고의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countReportedRecipesByReporterUserId(Long reporterUserId) {
        return recipeReportDAO.countReportedRecipesByReporterUserId(reporterUserId);
    }

    /**
     * 신고된 레시피 정보를 조회하여 ReportedRecipeDetailDTO로 반환하는 헬퍼 메서드.
     * @param recipeId 조회할 레시피의 ID
     * @return ReportedRecipeDetailDTO
     */
    private ReportedRecipeDetailDTO getReportedRecipeDetailDTO(Long recipeId) {
        // TODO: 실제 구현 시 RecipeDAO를 사용하여 tb_recipe 테이블에서 레시피 정보(제목, 썸네일)를 조회해야 합니다.
        // 현재는 편의상 RecipeVO를 조회하여 DTO로 변환하는 방식을 사용합니다.
        RecipeVO recipe = recipeDAO.selectRecipeById(recipeId);
        if (recipe != null) {
            return new ReportedRecipeDetailDTO(recipe.getRecipeId(), recipe.getOwnerUserId(), recipe.getTitle(), recipe.getThumbnailUrl());
        }

        // 임시 더미 데이터 반환 (레시피 정보가 없을 때)
        return new ReportedRecipeDetailDTO(recipeId, null, "알 수 없는 레시피 (ID: " + recipeId + ")", "https://default-recipe.png");
    }
}