package com.cucook.moc.recipe.service.support;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RecipeImageResolver {

    private final String baseUrl;

    public RecipeImageResolver(
            @Value("${server.base-url:http://localhost:8090}") String serverBaseUrl) {
        this.baseUrl = serverBaseUrl + "/image/";
    }

    public String resolveByCategory(String category) {

        if (category == null || category.isBlank()) {
            return baseUrl + "side_dish.png";
        }

        return switch (category) {
            case "rice_dish" -> baseUrl + "rice_dish.jpg";
            case "noodle" -> baseUrl + "noodle.jpg";
            case "soup_stew" -> baseUrl + "soup_stew.jpg";
            case "stir_fry" -> baseUrl + "stir_fry.jpg";
            case "grill_roast" -> baseUrl + "grill_roast.png";
            case "salad" -> baseUrl + "salad.png";
            case "side_dish" -> baseUrl + "side_dish.png";
            case "dessert_snack" -> baseUrl + "dessert_snack.png";
            default -> baseUrl + "side_dish.png";
        };
    }
}
