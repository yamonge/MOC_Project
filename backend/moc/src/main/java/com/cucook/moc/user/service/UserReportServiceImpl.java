package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.dao.UserReportRepository;
import com.cucook.moc.user.dto.request.UserReportRequestDTO;
import com.cucook.moc.user.dto.ReportedUserDetailDTO;
import com.cucook.moc.user.dto.response.UserReportListResponseDTO;
import com.cucook.moc.user.dto.response.UserReportResponseDTO;
import com.cucook.moc.user.vo.UserReportVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserReportServiceImpl implements UserReportService {

    private final UserReportRepository userReportRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserReportServiceImpl(UserReportRepository userReportRepository,
                                 UserRepository userRepository) {
        this.userReportRepository = userReportRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserReportResponseDTO addUserReport(Long reporterUserId, UserReportRequestDTO requestDTO) {
        if (requestDTO.getReportedUserId() == null || requestDTO.getReportReasonCd() == null || requestDTO.getReportReasonCd().isEmpty()) {
            throw new IllegalArgumentException("신고 대상 사용자 ID와 신고 사유 코드는 필수입니다.");
        }
        if (reporterUserId.equals(requestDTO.getReportedUserId())) {
            throw new IllegalArgumentException("자기 자신을 신고할 수 없습니다.");
        }

        UserReportVO vo = new UserReportVO();
        vo.setReporterUserId(reporterUserId);
        vo.setReportedUserId(requestDTO.getReportedUserId());
        vo.setReportReasonCd(requestDTO.getReportReasonCd());
        vo.setReportComment(requestDTO.getReportComment());
        vo.setProcessingStatusCd("PENDING");
        vo.setCreatedId(reporterUserId);

        vo = userReportRepository.save(vo);

        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(requestDTO.getReportedUserId());
        return UserReportResponseDTO.from(vo, reportedUserDetail);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReportListResponseDTO getReportedUsersByReporterUserId(Long reporterUserId) {
        List<UserReportVO> voList = userReportRepository.findByReporterUserId(reporterUserId);

        List<UserReportResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(vo.getReportedUserId());
                    return UserReportResponseDTO.from(vo, reportedUserDetail);
                })
                .collect(Collectors.toList());

        return new UserReportListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public UserReportResponseDTO getUserReportDetail(Long reportId, Long requestingUserId) {
        UserReportVO vo = userReportRepository.findById(reportId).orElse(null);

        if (vo == null) {
            throw new IllegalArgumentException("해당 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        if (!vo.getReporterUserId().equals(requestingUserId)) {
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 조회 권한이 없습니다.");
        }

        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(vo.getReportedUserId());
        return UserReportResponseDTO.from(vo, reportedUserDetail);
    }

    @Override
    @Transactional
    public UserReportResponseDTO updateUserReport(Long reportId, Long reporterUserId, UserReportRequestDTO requestDTO) {
        UserReportVO existingVo = userReportRepository.findById(reportId).orElse(null);

        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }

        if (!existingVo.getReporterUserId().equals(reporterUserId)) {
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 수정 권한이 없습니다.");
        }

        Optional.ofNullable(requestDTO.getReportReasonCd()).filter(cd -> !cd.isEmpty()).ifPresent(existingVo::setReportReasonCd);
        Optional.ofNullable(requestDTO.getReportComment()).ifPresent(existingVo::setReportComment);

        existingVo = userReportRepository.save(existingVo);

        ReportedUserDetailDTO reportedUserDetail = getReportedUserDetailDTO(existingVo.getReportedUserId());
        return UserReportResponseDTO.from(existingVo, reportedUserDetail);
    }

    @Override
    @Transactional
    public boolean deleteUserReport(Long reportId, Long reporterUserId) {
        UserReportVO existingVo = userReportRepository.findById(reportId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 사용자 신고 (ID: " + reportId + ")를 찾을 수 없습니다.");
        }
        if (!existingVo.getReporterUserId().equals(reporterUserId)) {
            throw new IllegalArgumentException("이 사용자 신고 (ID: " + reportId + ")에 대한 삭제 권한이 없습니다.");
        }

        int deletedCount = userReportRepository.deleteByReportIdAndReporterUserId(reportId, reporterUserId);
        return deletedCount > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public int countReportedUsersByReporterUserId(Long reporterUserId) {
        return userReportRepository.countByReporterUserId(reporterUserId);
    }

    private ReportedUserDetailDTO getReportedUserDetailDTO(Long userId) {
        return new ReportedUserDetailDTO(userId, "테스트 닉네임-" + userId, "https://default-profile.png");
    }
}
