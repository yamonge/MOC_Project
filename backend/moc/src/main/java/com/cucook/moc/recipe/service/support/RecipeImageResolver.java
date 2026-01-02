package com.cucook.moc.recipe.service.support;

import org.springframework.stereotype.Component;

@Component
public class RecipeImageResolver {

    private static final String BASE_URL =
            "http://localhost:8090/image/";

    public String resolveByCategory(String category) {

        if (category == null || category.isBlank()) {
            return BASE_URL + "side_dish.png"; // 안전한 기본값
        }

        return switch (category) {
            case "rice_dish" -> BASE_URL + "rice_dish.jpg";
            case "noodle" -> BASE_URL + "noodle.jpg";
            case "soup_stew" -> BASE_URL + "soup_stew.jpg";
            case "stir_fry" -> BASE_URL + "stir_fry.jpg";
            case "grill_roast" -> BASE_URL + "grill_roast.png";
            case "salad" -> BASE_URL + "salad.png";
            case "side_dish" -> BASE_URL + "side_dish.png";
            case "dessert_snack" -> BASE_URL + "dessert_snack.png";
            default -> BASE_URL + "side_dish.png";
        };
    }
}
