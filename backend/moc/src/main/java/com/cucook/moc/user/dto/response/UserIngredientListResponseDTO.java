package com.cucook.moc.user.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientListResponseDTO {
    private List<UserIngredientResponseDTO> userIngredients;
    private int totalCount;
}