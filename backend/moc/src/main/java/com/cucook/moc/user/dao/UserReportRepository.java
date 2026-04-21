package com.cucook.moc.user.dao;

import com.cucook.moc.user.vo.UserReportVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserReportRepository extends JpaRepository<UserReportVO, Long> {

    List<UserReportVO> findByReporterUserId(Long reporterUserId);

    int countByReporterUserId(Long reporterUserId);

    boolean existsByReporterUserIdAndReportedUserId(Long reporterUserId, Long reportedUserId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserReportVO r WHERE r.reportId = :reportId AND r.reporterUserId = :reporterUserId")
    int deleteByReportIdAndReporterUserId(@Param("reportId") Long reportId,
                                          @Param("reporterUserId") Long reporterUserId);
}
