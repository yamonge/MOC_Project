package com.cucook.moc.user.dto.response; // ⭐ user 패키지

import com.cucook.moc.user.dto.ReportedUserDetailDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter; // 날짜 포맷팅용

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReportResponseDTO {
    private Long reportId;          // 신고 ID (tb_user_report.user_report_id)
    private Long reporterUserId;    // 신고한 사용자 ID (tb_user_report.reporter_user_id)
    private Long reportedUserId;    // 신고 대상 사용자 ID (tb_user_report.reported_user_id)
    private String reportReasonCd;  // 신고 사유 코드
    private String reportComment;   // 상세 신고 내용
    private String processingStatusCd; // ⭐ 처리 상태 (PENDING, PROCESSED, REJECTED)
    private Timestamp createdDate;  // 신고일시
    private String createdDateFormatted; // ⭐ UI 표시용: "YYYY-MM-DD HH:mm:ss" 포맷
    private Timestamp processedDate; // 처리 일시
    private String processedDateFormatted; // UI 표시용
    private ReportedUserDetailDTO reportedUser;

    // UserReportVO와 ReportedUserDetailDTO를 기반으로 DTO를 생성하는 편의 메서드
    public static UserReportResponseDTO from(
            com.cucook.moc.user.vo.UserReportVO reportVO,
            ReportedUserDetailDTO reportedUserDetailDTO) {

        UserReportResponseDTO dto = new UserReportResponseDTO();
        dto.setReportId(reportVO.getReportId());
        dto.setReporterUserId(reportVO.getReporterUserId());
        dto.setReportedUserId(reportVO.getReportedUserId());
        dto.setReportReasonCd(reportVO.getReportReasonCd());
        dto.setReportComment(reportVO.getReportComment());
        dto.setProcessingStatusCd(reportVO.getProcessingStatusCd());
        dto.setCreatedDate(reportVO.getCreatedDate());
        dto.setProcessedDate(reportVO.getProcessedDate());

        // 날짜 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (reportVO.getCreatedDate() != null) {
            dto.setCreatedDateFormatted(reportVO.getCreatedDate().toLocalDateTime().format(formatter));
        } else {
            dto.setCreatedDateFormatted(null);
        }
        if (reportVO.getProcessedDate() != null) {
            dto.setProcessedDateFormatted(reportVO.getProcessedDate().toLocalDateTime().format(formatter));
        } else {
            dto.setProcessedDateFormatted(null);
        }

        dto.setReportedUser(reportedUserDetailDTO);

        return dto;
    }
}