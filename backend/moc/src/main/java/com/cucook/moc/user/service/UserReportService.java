package com.cucook.moc.user.service;

import com.cucook.moc.user.dto.request.UserReportRequestDTO;
import com.cucook.moc.user.dto.response.UserReportListResponseDTO;
import com.cucook.moc.user.dto.response.UserReportResponseDTO;
import com.cucook.moc.user.vo.UserReportVO; // 내부 로직에서 VO 사용 가능

import java.util.List; // UserReportListResponseDTO 내부에서 List 사용

/**
 * 사용자 신고(tb_user_report) 기능과 관련된 비즈니스 로직을 정의하는 서비스 인터페이스입니다.
 * 마이페이지의 '신고 내역' 중 사용자 신고 부분을 담당합니다.
 */
public interface UserReportService {

    /**
     * 다른 사용자를 신고합니다.
     *
     * @param reporterUserId 신고하는 사용자의 ID
     * @param requestDTO 신고 정보를 담은 요청 DTO (reportedUserId, reportReasonCd, reportComment 포함)
     * @return 작성된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락, 이미 신고한 경우 등
     */
    UserReportResponseDTO addUserReport(Long reporterUserId, UserReportRequestDTO requestDTO);

    /**
     * 특정 사용자가 '신고한' 모든 사용자 신고 목록을 조회합니다.
     * 마이페이지 '신고 내역' 탭의 사용자 신고 목록 표시용입니다.
     *
     * @param reporterUserId 신고 목록을 조회할 사용자의 ID
     * @return 사용자가 신고한 사용자 신고 목록과 총 개수를 담은 응답 DTO
     */
    UserReportListResponseDTO getReportedUsersByReporterUserId(Long reporterUserId);

    /**
     * 특정 사용자 신고 ID로 단일 신고 정보를 조회합니다.
     * (관리자/개발자용 또는 신고 수정/삭제 전 존재 여부 확인용)
     *
     * @param reportId 조회할 신고 ID
     * @param requestingUserId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @return 상세 사용자 신고 정보를 담은 응답 DTO 또는 null (해당 신고가 없을 경우)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    UserReportResponseDTO getUserReportDetail(Long reportId, Long requestingUserId);

    /**
     * 특정 사용자 신고 정보를 수정합니다. (신고 내용/사유만 수정 가능하도록)
     * (관리자 또는 신고한 사용자 본인이 수정할 때 사용)
     *
     * @param reportId 수정할 신고 ID
     * @param reporterUserId 신고 작성자의 ID (권한 확인용)
     * @param requestDTO 수정할 신고 정보를 담은 요청 DTO (reportReasonCd, reportComment 포함)
     * @return 수정된 신고 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    UserReportResponseDTO updateUserReport(Long reportId, Long reporterUserId, UserReportRequestDTO requestDTO);

    /**
     * 특정 사용자 신고 기록을 삭제합니다.
     * (관리자 또는 신고한 사용자 본인이 삭제할 때 사용)
     *
     * @param reportId 삭제할 신고 ID
     * @param reporterUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 신고를 찾을 수 없거나 권한이 없을 경우
     */
    boolean deleteUserReport(Long reportId, Long reporterUserId);

    /**
     * 특정 사용자가 '신고한' 사용자 신고의 총 개수를 조회합니다.
     * 마이페이지 '신고 내역' 카드에 표시용입니다.
     *
     * @param reporterUserId 개수를 조회할 사용자의 ID
     * @return 신고된 사용자 신고의 총 개수
     */
    int countReportedUsersByReporterUserId(Long reporterUserId);
}