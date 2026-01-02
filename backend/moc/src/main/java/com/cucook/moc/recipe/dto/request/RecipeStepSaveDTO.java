package com.cucook.moc.recipe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStepSaveDTO {
    private Integer stepNo;
    private String stepDesc;
}
