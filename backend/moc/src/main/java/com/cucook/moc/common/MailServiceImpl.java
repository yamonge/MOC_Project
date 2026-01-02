package com.cucook.moc.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress; // 발신자 이메일 (설정에서 가져옴)

    // 프론트엔드 주소 (예: http://localhost:3010)
    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    public MailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Override
    public void sendPasswordResetLinkMail(String to, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(fromAddress);
        message.setSubject("[MyOwnChef] 비밀번호 재설정 안내");
        message.setText(buildResetMailText(resetUrl));

        mailSender.send(message);
    }

    private String buildResetMailText(String resetUrl) {
        StringBuilder sb = new StringBuilder();
        sb.append("안녕하세요.\n\n");
        sb.append("비밀번호 재설정을 위한 인증 토큰을 안내드립니다.\n\n");
        sb.append("🔑 앱에서 비밀번호 재설정 화면으로 이동 후,\n");
        sb.append("아래 토큰을 복사하여 입력해주세요.\n\n");
        
        // URL에서 토큰만 추출하여 표시
        String token = resetUrl.substring(resetUrl.lastIndexOf("=") + 1);
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append(token).append("\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n\n");
        
        sb.append("※ 이 토큰은 1시간 동안만 유효합니다.\n");
        sb.append("※ 토큰 사용 후에는 자동으로 만료됩니다.\n\n");
        sb.append("감사합니다.");
        return sb.toString();
    }
}
