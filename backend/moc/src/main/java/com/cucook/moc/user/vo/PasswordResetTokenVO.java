package com.cucook.moc.user.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "tb_password_reset_token")
public class PasswordResetTokenVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resetTokenId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String resetToken;

    @Column(nullable = false)
    private Timestamp expireDate;

    @Column(nullable = false, length = 1)
    private String usedYn;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp createdDate;

    @Column
    private Timestamp usedDate;
}
