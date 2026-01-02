/* 메일 전송 테스트용
*  : sendTestMai() 메소드에서
* */
package com.cucook.moc.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class MailTestController {

    private final MailService mailService;

    public MailTestController(MailService mailService) {
        this.mailService = mailService;
    }

    @GetMapping("/mail")
    public String sendTestMail() {
        String to = "kiryunell159@gmail.com";
        String resetUrl = "http://localhost:3010/reset-password?token=TEST_TOKEN";

        mailService.sendPasswordResetLinkMail(to, resetUrl);

        return "메일 전송 시도 완료";
    }
}

