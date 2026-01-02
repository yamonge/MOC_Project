package com.cucook.moc.user.dto.response;

import com.cucook.moc.user.dto.ReviewedUserDetailDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewResponseDTO {
    private Long reviewId;
    private Long targetUserId;
    private Long writerUserId;
    private Long shoppingPostId;
    private Integer rating;
    private String userReviewComment;
    private Timestamp createdDate;
    private String createdDateFormatted; // 후기 받은 날짜

    private ReviewedUserDetailDTO writer;

    public static UserReviewResponseDTO from(
            com.cucook.moc.user.vo.UserReviewVO reviewVO,
            ReviewedUserDetailDTO writerDetailDTO) {

        UserReviewResponseDTO dto = new UserReviewResponseDTO();
        dto.setReviewId(reviewVO.getUserReviewId());
        dto.setTargetUserId(reviewVO.getTargetUserId());
        dto.setWriterUserId(reviewVO.getWriterUserId());
        dto.setShoppingPostId(reviewVO.getShoppingPostId());
        dto.setRating(reviewVO.getRating());
        dto.setUserReviewComment(reviewVO.getUserReviewComment());
        dto.setCreatedDate(reviewVO.getCreatedDate());

        // UI 표시용 날짜 포맷팅: Timestamp -> LocalDateTime -> String (현대 Java API 활용)
        if (reviewVO.getCreatedDate() != null) {
            dto.setCreatedDateFormatted(reviewVO.getCreatedDate().toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        } else {
            dto.setCreatedDateFormatted(null);
        }

        dto.setWriter(writerDetailDTO);

        return dto;
    }
}