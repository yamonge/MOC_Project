package com.cucook.moc.common;

public class EmailMaskingUtil {

    private EmailMaskingUtil() {
    }

    /**
     * 이메일 마스킹
     * 예)
     *  a@naver.com      -> *@naver.com
     *  ab@naver.com     -> a*@naver.com
     *  abc@naver.com    -> ab*@naver.com
     *  abcde@naver.com  -> ab***@naver.com
     */
    public static String maskEmail(String email) {
        if (email == null || email.isEmpty()) {
            return email;
        }

        int atIndex = email.indexOf("@");
        if (atIndex <= 0) {
            // 이메일 형식이 아니면 전체를 * 처리
            return "*".repeat(email.length());
        }

        String local = email.substring(0, atIndex);   // @ 앞부분
        String domain = email.substring(atIndex);     // @포함 뒷부분

        if (local.length() == 1) {
            return "*" + domain;
        } else if (local.length() == 2) {
            return local.charAt(0) + "*" + domain;
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(local.charAt(0));
            sb.append(local.charAt(1));
            for (int i = 2; i < local.length(); i++) {
                sb.append('*');
            }
            sb.append(domain);
            return sb.toString();
        }
    }
}
