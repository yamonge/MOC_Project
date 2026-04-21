package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminUserReportDAO;
import com.cucook.moc.admin.dto.request.AdminUserReportProcessRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminUserReportListItemResponseDTO;
import com.cucook.moc.admin.vo.AdminUserReportVO;
import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.FirebaseService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserReportServiceImpl implements AdminUserReportService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserReportServiceImpl.class);

    private final AdminUserReportDAO adminUserReportDAO;
    private final UserRepository userRepository;
    private final FirebaseService firebaseService;

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
    public List<AdminUserReportListItemResponseDTO> getUserReportList(AdminUserReportSearchRequestDTO searchDTO) {
        if (searchDTO == null) {
            searchDTO = new AdminUserReportSearchRequestDTO();
        }

        if (searchDTO.getStatusCd() == null || searchDTO.getStatusCd().trim().isEmpty()) {
            searchDTO.setStatusCd("ALL");
        }
        if (searchDTO.getLimit() == null || searchDTO.getLimit() <= 0) {
            searchDTO.setLimit(50);
        }

        List<AdminUserReportVO> list = adminUserReportDAO.selectUserReportList(
                searchDTO.getReasonCd(),
                searchDTO.getStatusCd(),
                searchDTO.getKeyword(),
                searchDTO.getLastUserReportId(),
                searchDTO.getLimit()
        );

        List<AdminUserReportListItemResponseDTO> result = new ArrayList<>();
        if (list == null) return result;

        for (AdminUserReportVO vo : list) {
            AdminUserReportListItemResponseDTO dto = new AdminUserReportListItemResponseDTO(
                    vo.getUserReportId(),
                    vo.getReportReasonCd(),
                    vo.getProcessingStatusCd(),
                    vo.getCreatedDate(),
                    vo.getReporterUserId(),
                    vo.getReporterNickname(),
                    vo.getReportedUserId(),
                    vo.getReportedNickname(),
                    vo.getReportComment()
            );
            result.add(dto);
        }

        return result;
    }

    @Override
    public void processUserReport(AdminUserReportProcessRequestDTO requestDTO) {
        if (requestDTO.getUserReportId() == null) {
            throw new IllegalArgumentException("userReportId는 필수입니다.");
        }
        if (requestDTO.getAdminUserId() == null) {
            throw new IllegalArgumentException("adminUserId는 필수입니다.");
        }
        requireAdminActive(requestDTO.getAdminUserId());
        if (requestDTO.getActionType() == null || requestDTO.getActionType().trim().isEmpty()) {
            throw new IllegalArgumentException("actionType은 필수입니다.");
        }

        AdminUserReportVO reportVO = adminUserReportDAO.selectUserReportById(requestDTO.getUserReportId());
        if (reportVO == null) {
            throw new IllegalArgumentException("신고 정보를 찾을 수 없습니다: " + requestDTO.getUserReportId());
        }

        String statusCd = "PROCESSED";
        Timestamp now = new Timestamp(System.currentTimeMillis());

        int updated = adminUserReportDAO.updateUserReportStatus(
                requestDTO.getUserReportId(),
                statusCd,
                requestDTO.getAdminUserId(),
                now
        );

        if (updated <= 0) {
            throw new IllegalStateException("신고 처리 상태 업데이트 실패: " + requestDTO.getUserReportId());
        }

        try {
            sendReportProcessNotifications(reportVO, requestDTO.getActionType());
        } catch (Exception e) {
            log.error("신고 처리 알림 전송 실패: {}", e.getMessage());
        }
    }

    private void sendReportProcessNotifications(AdminUserReportVO reportVO, String actionType) {
        UserVO reportedUser = userRepository.findById(reportVO.getReportedUserId()).orElse(null);
        UserVO reporterUser = userRepository.findById(reportVO.getReporterUserId()).orElse(null);

        if (reportedUser != null && reportedUser.getFcmToken() != null && !reportedUser.getFcmToken().isEmpty()) {
            String title;
            String body;

            if ("WARNING".equals(actionType)) {
                title = "⚠️ 경고 알림";
                body = "신고 검토 결과, 경고 조치가 부과되었습니다.";
            } else if ("SUSPEND".equals(actionType)) {
                title = "⚠️ 계정 정지 알림";
                body = "부적절한 행동으로 인해 계정이 정지되었습니다.";
            } else {
                title = "⚠️ 신고 처리 알림";
                body = "신고 건에 대한 조치가 취해졌습니다.";
            }

            Map<String, String> data = new HashMap<>();
            data.put("type", "REPORT_PROCESSED");
            data.put("actionType", actionType);

            firebaseService.sendPushNotificationWithData(
                    reportedUser.getFcmToken(),
                    title,
                    body,
                    data
            );
            log.info("피신고자 알림 전송 완료: {}", reportedUser.getUserNickname());
        }

        if (reporterUser != null && reporterUser.getFcmToken() != null && !reporterUser.getFcmToken().isEmpty()) {
            String title = "✅ 신고 처리 완료";
            String body = "신고하신 사용자에 대한 조치가 완료되었습니다.";

            Map<String, String> data = new HashMap<>();
            data.put("type", "REPORT_RESULT");
            data.put("actionType", actionType);

            firebaseService.sendPushNotificationWithData(
                    reporterUser.getFcmToken(),
                    title,
                    body,
                    data
            );
            log.info("신고자 알림 전송 완료: {}", reporterUser.getUserNickname());
        }
    }
}
