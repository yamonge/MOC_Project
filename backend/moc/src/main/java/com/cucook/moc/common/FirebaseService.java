package com.cucook.moc.common;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

@Service
public class FirebaseService {

    private static final Logger log = LoggerFactory.getLogger(FirebaseService.class);

    @PostConstruct
    public void initialize() {
        try {
            log.info("Firebase 초기화 시작...");

            String firebaseConfigPath = System.getenv("FIREBASE_CONFIG_PATH");

            FirebaseOptions options;

            if (firebaseConfigPath != null && !firebaseConfigPath.isEmpty()) {
                try (FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath)) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                }
            } else {
                // ✅ resources에서 classpath로 로드 (권장)
                try (InputStream serviceAccount =
                             getClass().getClassLoader().getResourceAsStream("firebase-service-account.json")) {

                    if (serviceAccount == null) {
                        log.error("firebase-service-account.json not found in resources/firebase/");
                        return;
                    }

                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                }
            }

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase 초기화 성공!");
            }
        } catch (Exception e) {
            log.error("Firebase 초기화 실패: {}", e.getMessage());
        }
    }

    public void sendPushNotification(String fcmToken, String title, String body) {
        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("푸시 알림 전송 성공: {}", response);
        } catch (Exception e) {
            log.error("푸시 알림 전송 실패: {}", e.getMessage());
        }
    }

    /**
     * 푸시 알림 전송 (Data Payload 포함)
     */
    public void sendPushNotificationWithData(String fcmToken, String title, String body, java.util.Map<String, String> data) {
        try {
            Message.Builder messageBuilder = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            // Data payload 추가
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            Message message = messageBuilder.build();
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("푸시 알림 전송 성공 (with data): {}", response);
        } catch (Exception e) {
            log.error("푸시 알림 전송 실패: {}", e.getMessage());
        }
    }

    public void sendPushNotificationMulti(List<String> fcmTokens, String title, String body) {
        for (String token : fcmTokens) {
            if (token != null && !token.isEmpty()) {
                sendPushNotification(token, title, body);
            }
        }
    }

    /**
     * 푸시 알림 다중 전송 (Data Payload 포함)
     */
    public void sendPushNotificationMultiWithData(List<String> fcmTokens, String title, String body, java.util.Map<String, String> data) {
        for (String token : fcmTokens) {
            if (token != null && !token.isEmpty()) {
                sendPushNotificationWithData(token, title, body, data);
            }
        }
    }
}
