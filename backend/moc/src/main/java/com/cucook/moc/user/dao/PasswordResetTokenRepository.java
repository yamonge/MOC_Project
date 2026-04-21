package com.cucook.moc.user.dao;

import com.cucook.moc.user.vo.PasswordResetTokenVO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenVO, Long> {

    PasswordResetTokenVO findByResetToken(String resetToken);

    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetTokenVO t SET t.usedYn = 'Y', t.usedDate = CURRENT_TIMESTAMP WHERE t.resetTokenId = :resetTokenId")
    void markTokenUsed(@Param("resetTokenId") Long resetTokenId);
}
