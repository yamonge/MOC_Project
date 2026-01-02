package com.cucook.moc.user.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReportListResponseDTO {
    private List<UserReportResponseDTO> reportedUsers; // 신고된 사용자 목록
    private int totalCount;                                   // 전체 신고 개수
}