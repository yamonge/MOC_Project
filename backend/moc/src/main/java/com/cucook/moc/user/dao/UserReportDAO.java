package com.cucook.moc.user.dao;

import com.cucook.moc.user.vo.UserReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map; // parameterType="map"을 위한 Map 임포트 (checkIfUserReportExists, deleteUserReport에서 사용)

@Mapper
public interface UserReportDAO {

    /**
     * 특정 사용자가 '신고한' 모든 사용자 신고 목록을 조회합니다.
     * `UserReportMapper.xml`의 `<select id="selectReportedUsersByReporterUserId">`와 매핑됩니다.
     * (마이페이지 '신고 내역' (사용자) 탭 표시용)
     *
     * @param reporterUserId 조회할 사용자의 ID (신고한 사람의 ID)
     * @return 해당 사용자가 신고한 UserReportVO 리스트
     */
    List<UserReportVO> selectReportedUsersByReporterUserId(Long reporterUserId);

    /**
     * 특정 사용자가 '신고한' 사용자 신고의 총 개수를 조회합니다.
     * `UserReportMapper.xml`의 `<select id="countReportedUsersByReporterUserId">`와 매핑됩니다.
     * (마이페이지 '신고 내역' 카드에 표시용)
     *
     * @param reporterUserId 조회할 사용자의 ID (신고한 사람의 ID)
     * @return 신고된 사용자 신고의 총 개수
     */
    int countReportedUsersByReporterUserId(Long reporterUserId);

    /**
     * 사용자 신고 정보를 데이터베이스에 저장합니다.
     * `UserReportMapper.xml`의 `<insert id="insertUserReport">`와 매핑됩니다.
     * (같이 장보기 중 다른 사용자를 신고할 때 사용)
     *
     * @param vo 저장할 UserReportVO 객체
     * @return 삽입된 레코드 수
     */
    int insertUserReport(UserReportVO vo);

    /**
     * 특정 사용자가 특정 대상을 신고한 기록이 이미 존재하는지 확인합니다.
     * `UserReportMapper.xml`의 `<select id="checkIfUserReportExists">`와 매핑됩니다.
     * (중복 신고 방지용)
     *
     * @param reporterUserId 신고한 사용자의 ID
     * @param reportedUserId 신고 대상 사용자의 ID
     * @return 신고 기록이 존재하면 1, 아니면 0
     */
    int checkIfUserReportExists(
            @Param("reporterUserId") Long reporterUserId,
            @Param("reportedUserId") Long reportedUserId);

    /**
     * 특정 사용자 신고 기록을 삭제합니다.
     * `UserReportMapper.xml`의 `<delete id="deleteUserReport">`와 매핑됩니다.
     * (관리자 또는 신고한 사용자 본인이 삭제할 때 사용)
     *
     * @param reportId 삭제할 신고 ID
     * @param reporterUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제된 레코드 수
     */
    int deleteUserReport(@Param("reportId") Long reportId, @Param("reporterUserId") Long reporterUserId);

    /**
     * 특정 사용자 신고 정보를 수정합니다.
     * `UserReportMapper.xml`의 `<update id="updateUserReport">`와 매핑됩니다.
     * (관리자 또는 신고한 사용자 본인이 수정할 때 사용)
     *
     * @param vo 수정할 UserReportVO 객체 (reportId, reporterUserId 포함)
     * @return 수정된 레코드 수
     */
    int updateUserReport(UserReportVO vo);

    /**
     * 특정 사용자 신고 ID로 단일 신고 정보를 조회합니다.
     * `UserReportMapper.xml`의 `<select id="selectUserReportById">`와 매핑됩니다.
     * (관리자/개발자용 또는 신고 수정/삭제 전 존재 여부 확인용)
     *
     * @param reportId 조회할 신고 ID
     * @return 해당 신고의 UserReportVO 객체 또는 null
     */
    UserReportVO selectUserReportById(Long reportId);
}