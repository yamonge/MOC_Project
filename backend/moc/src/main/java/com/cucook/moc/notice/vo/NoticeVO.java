package com.cucook.moc.notice.vo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

/**
 * tb_notice 테이블과 1:1로 매핑되는 Entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "tb_notice")
public class NoticeVO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeId;

    private String title;

    @Lob
    private String content;

    private String imageUrl;

    private Long viewCnt;

    @Column(length = 1)
    private String isPinned;

    @Column(length = 1)
    private String isVisible;

    private Long createdId;

    @CreationTimestamp
    private Timestamp createdDate;

    private Long updatedId;

    @UpdateTimestamp
    private Timestamp updatedDate;
}
