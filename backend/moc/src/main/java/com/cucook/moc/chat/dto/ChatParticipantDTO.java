package com.cucook.moc.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChatParticipantDTO {
    private Long userId;         // 내부 식별용
    private String nickname;     // 화면에 보일 닉네임
    private Double ratingScore;  // 선택: 그 사람의 평점 (tb_user.rating_score 같은 거)
    private Boolean isOwner;     // 방장 여부 (게시글 작성자)
    private String profileImageUrl; // 프로필 이미지 URL
}
