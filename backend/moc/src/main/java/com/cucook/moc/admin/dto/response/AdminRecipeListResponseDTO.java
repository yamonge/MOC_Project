package com.cucook.moc.admin.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminRecipeListResponseDTO {
    private boolean success;
    private List<AdminRecipeListItemResponseDTO> posts;

    public AdminRecipeListResponseDTO(boolean success, List<AdminRecipeListItemResponseDTO> posts) {
        this.success = success;
        this.posts = posts;
    }
}
