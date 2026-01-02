package com.cucook.moc.common;

public interface MailService {

    /**
     * 임시 비밀번호 메일 발송
     * @param to           수신자 이메일
     * @param tempPassword 임시 비밀번호
     */

    // 비밀번호 재설정 링크 발송
    void sendPasswordResetLinkMail(String to, String resultUrl);
}
