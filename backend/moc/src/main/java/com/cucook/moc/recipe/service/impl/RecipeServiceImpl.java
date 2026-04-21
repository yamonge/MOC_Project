package com.cucook.moc.recipe.service.impl;

import com.cucook.moc.recipe.client.GeminiApiUtils;
import com.cucook.moc.recipe.dao.RecipeRepository;
import com.cucook.moc.recipe.dto.request.*;
import com.cucook.moc.recipe.dto.response.*;
import com.cucook.moc.recipe.service.RecipeIngredientService;
import com.cucook.moc.recipe.service.RecipeService;
import com.cucook.moc.recipe.service.RecipeStepService;
import com.cucook.moc.recipe.service.support.RecipeImageResolver;
import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import com.cucook.moc.recipe.vo.RecipeStepVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import com.cucook.moc.user.dao.UserIngredientRepository;
import com.cucook.moc.user.service.UserIngredientService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private static final Logger log = LoggerFactory.getLogger(RecipeServiceImpl.class);

    private final RecipeRepository recipeRepository;
    private final GeminiApiUtils geminiApiUtils;
    private final ObjectMapper objectMapper;
    private final RecipeIngredientService recipeIngredientService;
    private final RecipeStepService recipeStepService;
    private final RecipeImageResolver recipeImageResolver;

    private final UserIngredientService userIngredientService;
    private final UserIngredientRepository userIngredientRepository;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository,
                             GeminiApiUtils geminiApiUtils,
                             ObjectMapper objectMapper,
                             RecipeIngredientService recipeIngredientService,
                             RecipeStepService recipeStepService,
                             UserIngredientService userIngredientService,
                             UserIngredientRepository userIngredientRepository,
                             RecipeImageResolver recipeImageResolver) {
        this.recipeRepository = recipeRepository;
        this.geminiApiUtils = geminiApiUtils;
        this.objectMapper = objectMapper;
        this.recipeIngredientService = recipeIngredientService;
        this.recipeStepService = recipeStepService;
        this.userIngredientService = userIngredientService;
        this.userIngredientRepository = userIngredientRepository;
        this.recipeImageResolver = recipeImageResolver;
    }

    @Override
    @Transactional
    public RecipeRecommendationResponseDTO recommendRecipes(RecipeGenerationRequestDTO requestDTO) {

        if (requestDTO.getSelectedIngredients() == null) {
            requestDTO.setSelectedIngredients(new ArrayList<>());
        }

        if (requestDTO.getSelectedIngredients() != null && requestDTO.getUserId() != null) {
            Long userId = Long.valueOf(requestDTO.getUserId());

            for (SelectedIngredientRequestDTO ing : requestDTO.getSelectedIngredients()) {
                if ("ALL".equalsIgnoreCase(ing.getUsageType())) {
                    try {
                        Long userIngredientId =
                                userIngredientRepository.findIdByUserIdAndIngredientName(userId, ing.getIngredientName());

                        if (userIngredientId != null) {
                            userIngredientService.deleteUserIngredient(userId, userIngredientId);
                            log.info("[RecipeService] 사용자 재료 삭제됨: {}", ing.getIngredientName());
                        }
                    } catch (Exception e) {
                        log.error("[RecipeService] 재료 삭제 실패: {} / {}", ing.getIngredientName(), e.getMessage());
                    }
                }
            }
        }

        String prompt = createGeminiPrompt(requestDTO);
        String aiResponseJson = "";
        try {
            aiResponseJson = geminiApiUtils.callGeminiApi(prompt);
        } catch (Exception e) {
            log.error("Gemini API 호출 실패: {}", e.getMessage());
            return new RecipeRecommendationResponseDTO(new ArrayList<>(), "ERROR", "레시피 생성 중 오류가 발생했습니다.");
        }

        List<RecommendedRecipeDTO> generatedRecipes;
        try {
            String pureJson = extractPureJson(aiResponseJson);
            generatedRecipes = parseGeminiRecipeResponse(pureJson, requestDTO);
        } catch (Exception e) {
            log.error("Gemini 응답 파싱 실패: {}", e.getMessage());
            return new RecipeRecommendationResponseDTO(new ArrayList<>(), "ERROR", "AI 응답 파싱 중 오류가 발생했습니다.");
        }

        List<RecommendedRecipeDTO> processedRecipes = new ArrayList<>();

        for (RecommendedRecipeDTO recipeDTO : generatedRecipes) {
            try {
                List<RecipeIngredientResponseDTO> responseIngredients =
                        calculateIngredientOwnership(
                                requestDTO.getSelectedIngredients(),
                                recipeDTO.getRequiredIngredients()
                        );

                recipeDTO.setRequiredIngredients(responseIngredients);
                recipeDTO.setThumbnailUrl(
                        recipeImageResolver.resolveByCategory(recipeDTO.getCategory())
                );

                processedRecipes.add(recipeDTO);

            } catch (Exception e) {
                log.error("추천 레시피 처리 실패 (제목: {})", recipeDTO.getTitle(), e);
            }
        }

        processedRecipes.sort(
                Comparator.<RecommendedRecipeDTO>comparingDouble(recipe -> {
                            double total = recipe.getRequiredIngredients().size();
                            long owned = recipe.getRequiredIngredients().stream()
                                    .filter(RecipeIngredientResponseDTO::isOwned)
                                    .count();
                            return total > 0 ? (double) owned / total : 0.0;
                        }).reversed()
                        .thenComparingInt(recipe -> (int) recipe.getRequiredIngredients().stream()
                                .filter(ing -> !ing.isOwned())
                                .count())
                        .thenComparing(recipe -> {
                            if (requestDTO.getFilterDifficultyCd() != null &&
                                    requestDTO.getFilterDifficultyCd().equalsIgnoreCase(recipe.getDifficultyCd())) {
                                return 0;
                            }
                            if ("EASY".equalsIgnoreCase(recipe.getDifficultyCd())) return 1;
                            if ("NORMAL".equalsIgnoreCase(recipe.getDifficultyCd())) return 2;
                            if ("HARD".equalsIgnoreCase(recipe.getDifficultyCd())) return 3;
                            return 4;
                        })
        );

        List<RecommendedRecipeDTO> finalRecommendedRecipes = processedRecipes.stream()
                .limit(3)
                .collect(Collectors.toList());

        return new RecipeRecommendationResponseDTO(finalRecommendedRecipes, "SUCCESS", "AI 레시피 추천이 완료되었습니다.");
    }

    private String extractPureJson(String raw) {
        int start = raw.indexOf('[');
        int end = raw.lastIndexOf(']');

        if (start == -1 || end == -1 || end < start) {
            throw new IllegalStateException("Invalid JSON from Gemini: " + raw);
        }
        return raw.substring(start, end + 1);
    }

    private String createGeminiPrompt(RecipeGenerationRequestDTO requestDTO) {

        String ingredientList = requestDTO.getSelectedIngredients().stream()
                .map(ing -> {
                    StringBuilder sb = new StringBuilder("- ").append(ing.getIngredientName());
                    if (ing.getUsageType() != null && !ing.getUsageType().isEmpty()) {
                        sb.append(" (사용량: ").append(ing.getUsageType()).append(")");
                    }
                    if (ing.getAmountHint() != null && !ing.getAmountHint().isEmpty()) {
                        sb.append(" (추정량: ").append(ing.getAmountHint()).append(")");
                    }
                    return sb.toString();
                })
                .collect(Collectors.joining("\n"));

        String difficulty = (requestDTO.getFilterDifficultyCd() != null && !requestDTO.getFilterDifficultyCd().isEmpty())
                ? requestDTO.getFilterDifficultyCd() : "ANY";

        String cuisine = (requestDTO.getFilterCuisineCd() != null && !requestDTO.getFilterCuisineCd().isEmpty())
                ? requestDTO.getFilterCuisineCd() : "ANY";

        String cookTime = (requestDTO.getFilterCookTimeCd() != null && !requestDTO.getFilterCookTimeCd().isEmpty())
                ? requestDTO.getFilterCookTimeCd() : "ANY";

        String promptTemplate =
                "당신은 최상급 요리 전문가 AI이며, 반드시 JSON만 반환해야 합니다.\n" +
                        "\n" +
                        "### [역할]\n" +
                        "- 사용자의 냉장고 재료만으로 창의적이고 실현 가능한 요리 3개를 추천\n" +
                        "- 각 레시피는 정확한 조리 단계를 포함해야 하며 한국인이 맛있다고 느끼는 밸런스를 유지\n" +
                        "- 절대 JSON 외의 텍스트를 출력하지 말 것\n" +
                        "\n" +
                        "### [사용자 재료 리스트]\n" +
                        "{{INGREDIENT_LIST}}\n" +
                        "\n" +
                        "### [사용자 필터 조건]\n" +
                        "- 요리 스타일(cuisineStyleCd): {{CUISINE}}\n" +
                        "- 난이도(difficultyCd): {{DIFFICULTY}}\n" +
                        "- 조리 시간(cookTimeMin): {{COOK_TIME}}\n" +
                        "\n" +
                        "### [카테고리 규칙]\n" +
                        "각 레시피의 category는 아래 중 하나여야 한다:\n" +
                        "[\"rice_dish\", \"noodle\", \"soup_stew\", \"stir_fry\", \"grill_roast\", \"salad\", \"side_dish\", \"dessert_snack\"]\n" +
                        "\n" +
                        "### [출력 JSON 스키마]\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"title\": \"string\",\n" +
                        "    \"summary\": \"string\",\n" +
                        "    \"difficultyCd\": \"EASY | NORMAL | HARD\",\n" +
                        "    \"cookTimeMin\": number,\n" +
                        "    \"cuisineStyleCd\": \"KOR | CHN | JPN | WES | ETC\",\n" +
                        "    \"category\": \"rice_dish | noodle | soup_stew | stir_fry | grill_roast | salad | side_dish | dessert_snack\",\n" +
                        "    \"requiredIngredients\": [ { \"ingredientName\": \"string\", \"quantityDesc\": \"string\" } ],\n" +
                        "    \"cookingSteps\": [ { \"stepNo\": number, \"stepDesc\": \"string\"} ]\n" +
                        "  }\n" +
                        "]\n" +
                        "\n" +
                        "### [출력 규칙]\n" +
                        "- 반드시 JSON 배열을 출력할 것\n" +
                        "- 레시피는 3개 생성할 것\n" +
                        "- ⚠️ 재료 이름은 사용자가 제공한 이름을 절대 변경하지 말고 정확히 그대로 사용\n" +
                        "- 예: 사용자 재료에 '친환경경주머니양파'가 있으면 레시피에도 '친환경경주머니양파'로 작성\n" +
                        "- 예: 사용자 재료에 '송송어린대파'가 있으면 레시피에도 '송송어린대파'로 작성\n" +
                        "- ⚠️ 재료량(quantityDesc)은 '1개', '200g', '1컵' 등 구체적인 양으로 새로 작성\n" +
                        "- ⚠️ 사용자 재료의 '사용량', '추정량' 정보는 참고만 하고 절대 복사하지 말 것\n" +
                        "- 잘못된 예: \"quantityDesc\": \"전부사용\" ❌\n" +
                        "- 올바른 예: \"quantityDesc\": \"1개\" ✅\n" +
                        "- 모든 단계(stepDesc)는 실제로 요리 가능한 수준으로 상세하게 작성\n" +
                        "\n" +
                        "### [이미지 규칙]\n" +
                        "- 당신은 어떤 이미지 URL도 생성하지 않습니다.\n" +
                        "- imageUrl 또는 thumbnailUrl을 생성하거나 포함하지 마세요.\n" +
                        "- 서버에서 recipe.category 값을 기준으로 이미지가 자동 매핑됩니다.\n" +
                        "- 모델은 반드시 category만 정확하게 생성해야 합니다.\n";

        return promptTemplate
                .replace("{{INGREDIENT_LIST}}", ingredientList)
                .replace("{{DIFFICULTY}}", difficulty)
                .replace("{{CUISINE}}", cuisine)
                .replace("{{COOK_TIME}}", cookTime);
    }

    private List<RecommendedRecipeDTO> parseGeminiRecipeResponse(String aiResponseJson,
                                                                 RecipeGenerationRequestDTO requestDTO) throws Exception {
        List<RecommendedRecipeDTO> recipes =
                objectMapper.readValue(aiResponseJson, new TypeReference<List<RecommendedRecipeDTO>>() {});

        for (RecommendedRecipeDTO recipe : recipes) {
            if (recipe.getCuisineStyleCd() == null || recipe.getCuisineStyleCd().isEmpty()) {
                recipe.setCuisineStyleCd(requestDTO.getFilterCuisineCd());
            }
            if (recipe.getDifficultyCd() == null || recipe.getDifficultyCd().isEmpty()) {
                recipe.setDifficultyCd(requestDTO.getFilterDifficultyCd());
            }

            if (recipe.getRequiredIngredients() != null) {
                List<RecipeIngredientResponseDTO> uniqueIngredients = recipe.getRequiredIngredients().stream()
                        .collect(Collectors.toMap(
                                ing -> ing.getIngredientName() + "|" + ing.getQuantityDesc(),
                                ing -> ing,
                                (existing, replacement) -> existing
                        ))
                        .values()
                        .stream()
                        .collect(Collectors.toList());
                recipe.setRequiredIngredients(uniqueIngredients);
            }
        }
        return recipes;
    }

    private RecipeVO mapToRecipeVO(RecommendedRecipeDTO dto, Long userId) {
        RecipeVO vo = new RecipeVO();
        vo.setOwnerUserId(userId);
        vo.setSourceType("AI_GENERATED");
        vo.setTitle(dto.getTitle());
        vo.setSummary(dto.getSummary());
        vo.setThumbnailUrl(null);
        vo.setDifficultyCd(dto.getDifficultyCd());
        vo.setCookTimeMin(dto.getCookTimeMin());
        vo.setCuisineStyleCd(dto.getCuisineStyleCd());
        vo.setCategory(dto.getCategory());

        vo.setIsPublic("N");
        vo.setIsDeleted("N");
        vo.setViewCnt(0);
        vo.setLikeCnt(0);
        vo.setReportCnt(0);
        vo.setCreatedId(userId);
        return vo;
    }

    private List<RecipeStepVO> mapToRecipeStepVOs(List<RecipeStepResponseDTO> dtos,
                                                  Long recipeId,
                                                  Long createdId) {
        return dtos.stream().map(dto -> {
            RecipeStepVO vo = new RecipeStepVO();
            vo.setRecipeId(recipeId);
            vo.setStepNo(dto.getStepNo());
            vo.setStepDesc(dto.getStepDesc());
            vo.setImageUrl(null);
            vo.setCreatedId(createdId);
            return vo;
        }).collect(Collectors.toList());
    }

    private List<RecipeIngredientVO> mapToRecipeIngredientVOs(List<RecipeIngredientResponseDTO> dtos,
                                                              Long recipeId,
                                                              Long createdId) {
        return dtos.stream().map(dto -> {
            RecipeIngredientVO vo = new RecipeIngredientVO();
            vo.setRecipeId(recipeId);
            vo.setIngredientName(dto.getIngredientName());
            vo.setQuantityDesc(dto.getQuantityDesc());
            vo.setIsOwnedDefault("N");
            vo.setCreatedId(createdId);
            return vo;
        }).collect(Collectors.toList());
    }

    private List<RecipeIngredientResponseDTO> calculateIngredientOwnership(
            List<SelectedIngredientRequestDTO> userSelectedIngredients,
            List<RecipeIngredientResponseDTO> recipeRequiredIngredientVOs) {

        Map<String, SelectedIngredientRequestDTO> userIngredientMap =
                userSelectedIngredients.stream()
                        .collect(Collectors.toMap(
                                SelectedIngredientRequestDTO::getIngredientName,
                                ing -> ing,
                                (existing, replacement) -> existing
                        ));

        return recipeRequiredIngredientVOs.stream().map(vo -> {
            RecipeIngredientResponseDTO dto = new RecipeIngredientResponseDTO();
            dto.setIngredientName(vo.getIngredientName());
            dto.setQuantityDesc(vo.getQuantityDesc());
            dto.setOwned(userIngredientMap.containsKey(vo.getIngredientName()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean toggleRecipeShareStatus(Long recipeId, Long userId, boolean shareStatus) {
        RecipeVO recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) throw new IllegalArgumentException("레시피를 찾을 수 없습니다.");

        if (!recipe.getOwnerUserId().equals(userId))
            throw new IllegalArgumentException("공유 상태 변경 권한이 없습니다.");

        String isPublic = shareStatus ? "Y" : "N";

        if (!recipe.getIsPublic().equalsIgnoreCase(isPublic)) {
            int updated = recipeRepository.updateRecipeIsPublic(recipeId, userId, isPublic);
            return updated > 0;
        }
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeListResponseDTO getSharedRecipesByUserId(Long userId) {
        List<RecipeVO> shared = recipeRepository.findByOwnerUserIdAndIsPublic(userId, "Y");
        List<RecipeResponseDTO> dtoList =
                shared.stream().map(RecipeResponseDTO::from).collect(Collectors.toList());
        return new RecipeListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public int countSharedRecipesByUserId(Long userId) {
        return recipeRepository.countByOwnerUserIdAndIsPublic(userId, "Y");
    }

    @Override
    @Transactional
    public Long saveRecipe(Long userId, RecipeSaveRequestDTO dto) {

        RecipeVO recipeVO = new RecipeVO();
        recipeVO.setOwnerUserId(userId);
        recipeVO.setSourceType("AI_GENERATED");
        recipeVO.setTitle(dto.getTitle());
        recipeVO.setSummary(dto.getSummary());
        recipeVO.setThumbnailUrl(dto.getThumbnailUrl());
        recipeVO.setDifficultyCd(dto.getDifficultyCd());
        recipeVO.setCookTimeMin(dto.getCookTimeMin());
        recipeVO.setCuisineStyleCd(dto.getCuisineStyleCd());
        recipeVO.setCategory(dto.getCategory());
        recipeVO.setIsPublic(dto.isShare() ? "Y" : "N");
        recipeVO.setIsDeleted("N");
        recipeVO.setViewCnt(0);
        recipeVO.setLikeCnt(0);
        recipeVO.setReportCnt(0);
        recipeVO.setCreatedId(userId);

        RecipeVO savedRecipe = recipeRepository.save(recipeVO);
        Long recipeId = savedRecipe.getRecipeId();

        if (dto.getIngredients() != null) {
            for (RecipeIngredientSaveDTO ing : dto.getIngredients()) {

                if (ing.getIngredientName() == null || ing.getIngredientName().isBlank()) {
                    throw new IllegalArgumentException("ingredientName is required");
                }

                if (ing.getQuantityDesc() == null || ing.getQuantityDesc().isBlank()) {
                    throw new IllegalArgumentException("quantityDesc is required");
                }

                RecipeIngredientVO vo = new RecipeIngredientVO();
                vo.setRecipeId(recipeId);
                vo.setIngredientName(ing.getIngredientName());
                vo.setQuantityDesc(ing.getQuantityDesc());
                vo.setIsOwnedDefault("N");
                vo.setCreatedId(userId);
                log.info("saveRecipe thumbnailUrl = {}", dto.getThumbnailUrl());
                recipeIngredientService.saveRecipeIngredient(vo);
            }
        }

        if (dto.getSteps() == null || dto.getSteps().isEmpty()) {
            throw new IllegalArgumentException("steps required");
        }

        for (RecipeStepSaveDTO step : dto.getSteps()) {

            if (step.getStepNo() == null) {
                throw new IllegalArgumentException("stepNo is required");
            }

            if (step.getStepDesc() == null || step.getStepDesc().isBlank()) {
                throw new IllegalArgumentException("stepDesc is required");
            }

            RecipeStepVO vo = new RecipeStepVO();
            vo.setRecipeId(recipeId);
            vo.setStepNo(step.getStepNo());
            vo.setStepDesc(step.getStepDesc());
            vo.setImageUrl(null);
            vo.setCreatedId(userId);

            recipeStepService.saveRecipeStep(vo);
        }

        return recipeId;
    }
}
