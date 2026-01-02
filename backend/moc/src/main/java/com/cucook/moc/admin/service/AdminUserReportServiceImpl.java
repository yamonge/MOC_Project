package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminUserReportDAO;
import com.cucook.moc.admin.dto.request.AdminUserReportProcessRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserReportSearchRequestDTO;
import com.cucook.moc.admin.dto.response.AdminUserReportListItemResponseDTO;
import com.cucook.moc.admin.vo.AdminUserReportVO;
import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.vo.UserVO;
import com.cucook.moc.common.FirebaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserReportServiceImpl implements AdminUserReportService {

    private final AdminUserReportDAO adminUserReportDAO;
    private final UserDAO userDAO;
    private final FirebaseService firebaseService;

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

        List<AdminUserReportVO> list = adminUserReportDAO.selectUserReportList(searchDTO);

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
        if (requestDTO.getActionType() == null || requestDTO.getActionType().trim().isEmpty()) {
            throw new IllegalArgumentException("actionType은 필수입니다.");
        }

        // 🔥 1. 신고 정보 조회
        AdminUserReportVO reportVO = adminUserReportDAO.selectUserReportById(requestDTO.getUserReportId());
        if (reportVO == null) {
            throw new IllegalArgumentException("신고 정보를 찾을 수 없습니다: " + requestDTO.getUserReportId());
        }

        // 처리상태는 필터/리스트에 쓰기 좋게 PROCESSED로 통일
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

        // 🔥 2. 알림 전송
        try {
            sendReportProcessNotifications(reportVO, requestDTO.getActionType());
        } catch (Exception e) {
            // 알림 전송 실패해도 신고 처리는 성공으로 처리
            System.err.println("⚠️ 신고 처리 알림 전송 실패: " + e.getMessage());
        }
    }

    /**
     * 신고 처리 완료 알림 전송
     * - 피신고자: 경고/정지 조치 알림
     * - 신고자: 신고 처리 완료 알림
     */
    private void sendReportProcessNotifications(AdminUserReportVO reportVO, String actionType) {
        // 피신고자 정보 조회
        UserVO reportedUser = userDAO.selectById(reportVO.getReportedUserId());
        // 신고자 정보 조회
        UserVO reporterUser = userDAO.selectById(reportVO.getReporterUserId());

        // 🔥 피신고자에게 알림
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
            System.out.println("✅ 피신고자 알림 전송 완료: " + reportedUser.getUserNickname());
        }

        // 🔥 신고자에게 알림
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
            System.out.println("✅ 신고자 알림 전송 완료: " + reporterUser.getUserNickname());
        }
    }
}
