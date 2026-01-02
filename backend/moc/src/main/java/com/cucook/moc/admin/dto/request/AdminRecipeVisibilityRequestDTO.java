package com.cucook.moc.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 공개/숨김 토글 바디
 * - hidden: true면 숨김(is_public='N')
 */
@Getter
@Setter
public class AdminRecipeVisibilityRequestDTO {
    private Boolean hidden;
}
