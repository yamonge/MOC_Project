package com.cucook.moc.user.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class IngredientConsumeRequestDTO {

    private Long recipeId;
    private List<ConsumeIngredientDTO> ingredients;

    @Data
    public static class ConsumeIngredientDTO {
        private Long userIngredientId;
        private String usageType; // "ALL" | "PARTIAL"
    }
}
