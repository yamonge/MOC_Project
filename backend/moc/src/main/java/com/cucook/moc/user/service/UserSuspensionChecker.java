package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserDAO;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;

@RequiredArgsConstructor
public class UserSuspensionChecker {

    private final UserDAO userDAO;

    /**
     * 정책:
     * - user_status가 ACTIVE면 suspended_until이 NULL이어도 정상
     * - SUSPENDED일 때만 suspended_until을 해석
     *   - NULL이면 영구정지
     *   - 만료면 자동복구
     */
    public void checkAndNormalizeSuspension(Long userId, String userStatus, Timestamp suspendedUntil) {

        // ✅ 1) ACTIVE(또는 그 외)면 suspended_until은 무시하고 정상 처리
        if (userStatus == null || !"SUSPENDED".equals(userStatus)) {
            return;
        }

        // ✅ 2) SUSPENDED + suspended_until NULL => 영구정지(정책)
        if (suspendedUntil == null) {
            throw new IllegalStateException("SUSPENDED_PERMANENT");
        }

        // ✅ 3) SUSPENDED + 만료 => 자동복구 후 정상 처리
        int restored = userDAO.restoreExpiredSuspensionToActive(userId);
        if (restored > 0) {
            return;
        }

        // ✅ 4) SUSPENDED + 미래 => 기간정지 유지
        throw new IllegalStateException("SUSPENDED_TEMP");
    }
}
