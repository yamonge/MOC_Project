package com.cucook.moc.user.service; // ⭐ user 패키지 아래에 service.impl을 생성

import com.cucook.moc.user.dao.UserDAO;        // 신고 대상 사용자 정보 조회용 DAO (tb_user 테이블과 연결)
import com.cucook.moc.user.dao.UserReportDAO;     // 사용자 신고 DAO
import com.cucook.moc.user.dto.request.UserReportRequestDTO;
import com.cucook.moc.user.dto.ReportedUserDetailDTO; // 신고 대상 사용자 상세 DTO
import com.cucook.moc.user.dto.response.UserReportListResponseDTO;
import com.cucook.moc.user.dto.response.UserReportResponseDTO;
import com.cucook.moc.user.vo.UserReportVO;      // VO 사용

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Spring 서비스 컴포넌트로 등록
public class UserReportServiceImpl implements UserReportService {

    private final UserReportDAO userReportDAO;
    private final UserDAO userDAO; // 신고 대상 사용자 정보(닉네임, 프로필 이미지) 조회를 위해 주입

    @Autowired // 생성자 주입
    public UserReportServiceImpl(UserReportDAO userReportDAO,
                                 UserDAO userDAO) {
        this.userReportDAO = userReportDAO;
        this.userDAO = userDAO;
    }

    /**
     * 다른 사용자를 신고합니다.
     *
     * @param reporterUserId 신고하는 사용자의 ID
     * @param requestDTO 신고 정보를 담은 요청 DTO (reportedUserId, reportReasonCd, reportComment 포함)
     * @return 작성된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락, 이미 신고한 경우 등
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserReportResponseDTO addUserReport(Long reporterUserId, UserReportRequestDTO requestDTO) {
        // 필수 필드 유효성 검사
        if (requestDTO.getReportedUserId() == null || requestDTO.getReportReasonCd() == null || requestDTO.getReportReasonCd().isEmpty()) {
            throw new IllegalArgumentException("신고 대상 사용자 ID와 신고 사유 코드는 필수입니다.");
        }
        if (reporterUserId.equals(requestDTO.getReportedUserId())) {
            throw new IllegalArgumentException("자기 자신을 신고할 수 없습니다.");
        }

        // 1. 신고 대상 사용자 존재 여부 확인 (UserDAO의 selectUserById가 필요)
        // UserVO reportedUser = userDAO.selectUserById(requestDTO.getReportedUserId()); // 실제 UserDAO 호출 예시
        // if (reportedUser == null) {
        //     throw new IllegalArgumentException("신고 대상 사용자 (ID: " + requestDTO.getReportedUserId() + ")를 찾을 수 없습니다.");
        // }
        // ⭐ 현재 UserDAO에 selectUserById가 없으므로 임시로 이 로직은 주석 처리합니다.
        //    실제 구현 시 userDAO를 통해 사용자 존재 여부를 확인해야 합니다.

        // 2. 중복 신고 허용 (제한 제거)
        // if (userReportDAO.checkIfUserReportExists(reporterUserId, requestDTO.getReportedUserId()) > 0) {
        //     throw new IllegalArgumentException("이미 해당 사용자 (ID: " + requestDTO.getReportedUserId() + ")를 신고했습니다.");
        // }

        // 3. Request DTO -> VO 변환 및 설정
        UserReportVO vo = new UserReportVO();
        vo.setReporterUserId(reporterUserId); // 신고하는 사용자 ID 설정
        vo.setReportedUserId(requestDTO.getReportedUserId()); // 신고 대상 사용자 ID 설정
        vo.setReportReasonCd(requestDTO.getReportReasonCd());
        vo.setReportComment(requestDTO.getReportComment());
        vo.setProcessingStatusCd("PENDING"); // 초기 상태는 'PENDING'으로 설정
        vo.setCreatedId(reporterUserId); // 생성자 ID를 신고자 ID로 설정
        // createdDate, processedDate는 DB default 값에 맡김

        // 4. DB에 저장
        int insertedCount = userReportDAO.insertUserReport(vo);
        if (insertedCount == 0 || vo.getReportId() == null) {
            throw new RuntimeException("사용자 신고 저장에 실패했습니다.");
        }

        // 5. 저장된 정보를 기반으로 Response DTO 생성 및 반환
        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(requestDTO.getReportedUserId()); // 신고 대상 사용자 정보 조회
        return UserReportResponseDTO.from(vo, reportedUserDetail); // 편의 메서드 사용
    }

    /**
     * 특정 사용자가 '신고한' 모든 사용자 신고 목록을 조회합니다.
     * 마이페이지 '신고 내역' 탭의 사용자 신고 목록 표시용입니다.
     *
     * @param reporterUserId 신고 목록을 조회할 사용자의 ID
     * @return 사용자가 신고한 사용자 신고 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public UserReportListResponseDTO getReportedUsersByReporterUserId(Long reporterUserId) {
        List<UserReportVO> voList = userReportDAO.selectReportedUsersByReporterUserId(reporterUserId);

        // VO 리스트 -> DTO 리스트 변환 (신고 대상 사용자 상세 정보 포함)
        List<UserReportResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(vo.getReportedUserId()); // 각 신고 대상 사용자 정보 조회
                    return UserReportResponseDTO.from(vo, reportedUserDetail);
                })
                .collect(Collectors.toList());

        return new UserReportListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 사용자 신고 ID로 단일 신고 정보를 조회합니다.
     *
     * @param reportId 조회할 신고 ID
     * @param requestingUserId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @return 상세 사용자 신고 정보를 담은 응답 DTO 또는 null (해당 신고가 없을 경우)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserReportResponseDTO getUserReportDetail(Long reportId, Long requestingUserId) {
        UserReportVO vo = userReportDAO.selectUserReportById(reportId);

        // 신고 존재 여부 확인
        if (vo == null) {
            throw new IllegalArgumentException("해당 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        // 권한 확인: 신고한 사용자(reporter) 본인 또는 관리자만 조회 가능
        if (!vo.getReporterUserId().equals(requestingUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 조회 권한이 없습니다.");
        }

        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(vo.getReportedUserId()); // 신고 대상 사용자 정보 조회
        return UserReportResponseDTO.from(vo, reportedUserDetail);
    }

    /**
     * 특정 사용자 신고 정보를 수정합니다. (신고 내용/사유만 수정 가능하도록)
     *
     * @param reportId 수정할 신고 ID
     * @param reporterUserId 신고 작성자의 ID (권한 확인용)
     * @param requestDTO 수정할 신고 정보를 담은 요청 DTO (reportReasonCd, reportComment 포함)
     * @return 수정된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserReportResponseDTO updateUserReport(Long reportId, Long reporterUserId, UserReportRequestDTO requestDTO) {
        UserReportVO existingVo = userReportDAO.selectUserReportById(reportId);

        // 신고 존재 여부 확인
        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        // 권한 확인: 신고한 사용자 본인만 수정 가능 (관리자도 가능하도록 확장 가능)
        if (!existingVo.getReporterUserId().equals(reporterUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 수정 권한이 없습니다.");
        }

        // DTO -> VO 업데이트
        // 관리자 처리 상태(processingStatusCd), 신고 대상 ID 등은 여기서 수정하지 않음 (별도 관리자 API에서 처리)
        Optional.ofNullable(requestDTO.getReportReasonCd()).filter(cd -> !cd.isEmpty()).ifPresent(existingVo::setReportReasonCd);
        Optional.ofNullable(requestDTO.getReportComment()).ifPresent(existingVo::setReportComment);

        int updatedCount = userReportDAO.updateUserReport(existingVo);
        if (updatedCount == 0) {
            throw new RuntimeException("사용자 신고 정보 수정에 실패했습니다.");
        }

        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(existingVo.getReportedUserId()); // 신고 대상 사용자 정보 조회
        return UserReportResponseDTO.from(existingVo, reportedUserDetail);
    }

    /**
     * 특정 사용자 신고 기록을 삭제합니다.
     *
     * @param reportId 삭제할 신고 ID
     * @param reporterUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public boolean deleteUserReport(Long reportId, Long reporterUserId) {
        // 1. 삭제 전 권한 확인
        UserReportVO existingVo = userReportDAO.selectUserReportById(reportId);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }
        // 권한 확인: 신고한 사용자 본인만 삭제 가능 (관리자도 가능하도록 확장 가능)
        if (!existingVo.getReporterUserId().equals(reporterUserId)) { // TODO: 관리자 권한 확인 로직 추가
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 삭제 권한이 없습니다.");
        }

        // 2. DB에서 삭제
        int deletedCount = userReportDAO.deleteUserReport(reportId, reporterUserId); // DAO 메서드에 reporterUserId도 전달
        return deletedCount > 0;
    }

    /**
     * 특정 사용자가 '신고한' 사용자 신고의 총 개수를 조회합니다.
     * 마이페이지 '신고 내역' 카드에 표시용입니다.
     *
     * @param reporterUserId 개수를 조회할 사용자의 ID
     * @return 신고된 사용자 신고의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countReportedUsersByReporterUserId(Long reporterUserId) {
        return userReportDAO.countReportedUsersByReporterUserId(reporterUserId);
    }

    /**
     * 신고 대상 사용자 정보를 조회하여 ReportedUserDetailDTO로 반환하는 헬퍼 메서드.
     * @param userId 조회할 사용자의 ID
     * @return ReportedUserDetailDTO
     */
    private ReportedUserDetailDTO getReportedUserDetailDTO(Long userId) {
        // TODO: 실제 구현 시 UserDAO를 사용하여 tb_user 테이블에서 사용자 정보(닉네임, 프로필 이미지)를 조회해야 합니다.
        // 현재 UserDAO가 UserVO와 매핑되지 않고, tb_user 테이블도 없으므로 임시 더미 데이터를 반환합니다.

        // UserVO user = userDAO.selectUserById(userId); // 실제 UserDAO 호출 예시 (UserDAO에 selectUserById 필요)
        // if (user != null) {
        //     return new ReportedUserDetailDTO(user.getUserId(), user.getNickname(), user.getProfileImageUrl());
        // }

        // ⭐ 임시 더미 데이터 반환 (UserDAO가 아직 없거나 유저 정보가 미완성일 때)
        return new ReportedUserDetailDTO(userId, "테스트 닉네임-" + userId, "https://default-profile.png");
    }
}