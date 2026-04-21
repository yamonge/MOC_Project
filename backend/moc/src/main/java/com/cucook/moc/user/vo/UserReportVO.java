package com.cucook.moc.user.vo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "tb_user_report")
public class UserReportVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_report_id")
    private Long reportId;

    @Column(nullable = false)
    private Long reporterUserId;

    @Column(nullable = false)
    private Long reportedUserId;

    @Column(nullable = false, length = 20)
    private String reportReasonCd;

    @Column(length = 1000)
    private String reportComment;

    @Column(nullable = false, length = 20)
    private String processingStatusCd;

    @Column
    private Long createdId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp createdDate;

    @Column
    private Timestamp processedDate;

    @Column
    private Long processorId;
}
