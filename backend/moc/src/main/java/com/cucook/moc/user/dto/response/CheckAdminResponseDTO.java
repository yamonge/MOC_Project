package com.cucook.moc.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CheckAdminResponseDTO {
    private boolean isAdmin;      // true/false
    private String userType;      // 'Y' or 'N'
    private String userStatus;    // ACTIVE / SUSPENDED / WITHDRAW
}
