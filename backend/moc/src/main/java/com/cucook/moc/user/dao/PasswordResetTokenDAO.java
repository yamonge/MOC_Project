package com.cucook.moc.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cucook.moc.user.vo.PasswordResetTokenVO;

@Mapper
public interface PasswordResetTokenDAO {

    void insertToken(PasswordResetTokenVO tokenVO);

    PasswordResetTokenVO findByToken(@Param("resetToken") String resetToken);

    void markTokenUsed(@Param("resetTokenId") Long resetTokenId);
}
