package com.cucook.moc.admin.service;

import com.cucook.moc.admin.dao.AdminUserDAO;
import com.cucook.moc.admin.dto.request.AdminUserActivateRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserSearchRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserSuspendRequestDTO;
import com.cucook.moc.admin.dto.request.AdminUserWithdrawRequestDTO;
import com.cucook.moc.admin.dto.response.AdminUserListItemResponseDTO;
import com.cucook.moc.admin.dto.response.AdminUserListResponseDTO;
import com.cucook.moc.admin.vo.AdminUserVO;
import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.vo.UserVO;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * ✅ 구현체 규칙
 * - @RequiredArgsConstructor 사용
 * - 인터페이스 메서드는 전부 @Override 사용
 */
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserDAO adminUserDAO;
    private final UserDAO userDAO;

    // JoinDate 포맷터
    private static final DateTimeFormatter JOIN_DATE_FMT =
            DateTimeFormatter.ofPattern("yyyy.MM.dd").withZone(ZoneId.systemDefault());

    // 사용자 목록 조회
    @Override
    public AdminUserListResponseDTO getUserList(Long adminUserId, AdminUserSearchRequestDTO request) {
        requireAdminActive(adminUserId);

        // 방어적 기본값
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            request.setStatus("ALL");
        }
        if (request.getLimit() == null || request.getLimit() <= 0) {
            request.setLimit(50);
        }
        if (request.getKeyword() != null && request.getKeyword().trim().isEmpty()) {
            request.setKeyword(null);
        }

        List<AdminUserVO> voList = adminUserDAO.selectAdminUserList(request);

        List<AdminUserListItemResponseDTO> items = new ArrayList<>();
        Long nextCursor = null;

        for (AdminUserVO vo : voList) {
            AdminUserListItemResponseDTO dto = new AdminUserListItemResponseDTO();
            dto.setId(vo.getUserId());
            dto.setEmail(vo.getUserEmail());
            dto.setName(vo.getUserName());
            dto.setNickname(vo.getUserNickname());
            dto.setStatus(vo.getUserStatus()); // ACTIVE/SUSPENDED 그대로
            dto.setReportCount(vo.getReportedCnt() == null ? 0 : vo.getReportedCnt());
            dto.setJoinDate(formatJoinDate(vo.getCreatedDate()));
            dto.setSuspendedUntil(vo.getSuspendedUntil());

            items.add(dto);
            nextCursor = vo.getUserId(); // DESC 정렬이므로 마지막에 남는 값이 다음 cursor로 적합
        }

        AdminUserListResponseDTO res = new AdminUserListResponseDTO();
        res.setUsers(items);
        res.setNextCursor(nextCursor);
        return res;
    }

    // 사용자 정지
    @Override
    public void suspendUser(Long adminUserId, Long targetUserId, AdminUserSuspendRequestDTO request) {
        requireAdminActive(adminUserId);

        AdminUserVO target = adminUserDAO.selectAdminUserById(targetUserId);
        if (target == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대상 사용자를 찾을 수 없습니다.");
        }
        if (!"N".equalsIgnoreCase(target.getUserType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "일반 사용자만 정지할 수 있습니다.");
        }
        if ("WITHDRAW".equalsIgnoreCase(target.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "탈퇴 사용자는 정지할 수 없습니다.");
        }

        String suspendType = request.getSuspendType();
        if (suspendType == null || suspendType.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "suspendType이 필요합니다.");
        }

        Timestamp suspendedUntil = computeSuspendedUntil(suspendType);
        String reason = request.getReason();

        int updated = adminUserDAO.updateUserStatus(
                targetUserId,
                "SUSPENDED",
                suspendedUntil,
                reason,
                adminUserId
        );

        if (updated != 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "정지 처리에 실패했습니다.");
        }
    }

    // 사용자활성화
    @Override
    public void activateUser(Long adminUserId, Long targetUserId, AdminUserActivateRequestDTO request) {
        requireAdminActive(adminUserId);

        AdminUserVO target = adminUserDAO.selectAdminUserById(targetUserId);
        if (target == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대상 사용자를 찾을 수 없습니다.");
        }
        if (!"N".equalsIgnoreCase(target.getUserType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "일반 사용자만 활성화할 수 있습니다.");
        }
        if ("WITHDRAW".equalsIgnoreCase(target.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "탈퇴 사용자는 활성화할 수 없습니다.");
        }

        int updated = adminUserDAO.updateUserStatus(
                targetUserId,
                "ACTIVE",
                null,
                null,
                adminUserId
        );

        if (updated != 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "활성화 처리에 실패했습니다.");
        }
    }


    // 사용자 탈퇴 처리
    @Override
    public void withdrawUser(Long adminUserId, Long targetUserId, AdminUserWithdrawRequestDTO request) {
        requireAdminActive(adminUserId);

        AdminUserVO target = adminUserDAO.selectAdminUserById(targetUserId);
        if (target == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대상 사용자를 찾을 수 없습니다.");
        }
        if (!"N".equalsIgnoreCase(target.getUserType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "일반 사용자만 탈퇴 처리할 수 있습니다.");
        }

        // WITHDRAW는 소프트삭제: 목록에서 제외되도록 상태만 변경
        int updated = adminUserDAO.updateUserStatus(
                targetUserId,
                "WITHDRAW",
                null,
                request.getReason(),
                adminUserId
        );

        if (updated != 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "탈퇴 처리에 실패했습니다.");
        }
    }
    // 관리자 인증 및 활성 상태 검증
    private void requireAdminActive(Long adminUserId) {
        if (adminUserId == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 인증이 필요합니다.");
        }

        UserVO admin = userDAO.selectById(adminUserId);
        if (admin == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 인증이 필요합니다.");
        }
        if (!"Y".equalsIgnoreCase(admin.getUserType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 접근할 수 있습니다.");
        }
        if (!"ACTIVE".equalsIgnoreCase(admin.getUserStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비활성 관리자 계정입니다.");
        }
    }

    // suspendType에 따른 정지 종료일 계산
    private Timestamp computeSuspendedUntil(String suspendType) {
        String s = suspendType.trim().toUpperCase();

        Instant now = Instant.now();

        if ("ONE_DAY".equals(s)) {
            return Timestamp.from(now.plus(1, ChronoUnit.DAYS));
        }
        if ("THREE_DAYS".equals(s)) {
            return Timestamp.from(now.plus(3, ChronoUnit.DAYS));
        }
        if ("SEVEN_DAYS".equals(s)) {
            return Timestamp.from(now.plus(7, ChronoUnit.DAYS));
        }
        if ("PERMANENT".equals(s)) {
            // "영구"는 아주 긴 기간으로 처리 (예: 100년)
            return Timestamp.from(now.plus(36500, ChronoUnit.DAYS));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 suspendType입니다.");
    }

    private String formatJoinDate(Timestamp ts) {
        if (ts == null) return null;
        return JOIN_DATE_FMT.format(ts.toInstant());
    }
}
