package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import com.cucook.moc.recipe.vo.RecipeIngredientVO;
import com.cucook.moc.recipe.vo.RecipeStepVO;
import com.cucook.moc.recipe.vo.RecipeVO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

public class RecipeBoardRepositoryImpl implements RecipeBoardRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<RecipeBoardListItemVO> findPublicRecipes(
            Long loginUserId, String search, String cuisineStyleCd,
            String difficultyCd, Integer maxCookTimeMin, String sort,
            int offset, int limit) {

        StringBuilder sql = new StringBuilder(
                "SELECT r.recipeId, r.title, r.summary, r.thumbnailUrl, " +
                "r.difficultyCd, r.cookTimeMin, r.cuisineStyleCd, r.category, " +
                "r.viewCnt, r.likeCnt, r.createdDate, r.ownerUserId, " +
                "u.userNickname, u.userProfileImageUrl, " +
                "CASE WHEN EXISTS (" +
                "  SELECT 1 FROM tb_recipe_like l WHERE l.recipeId = r.recipeId AND l.userId = :loginUserId" +
                ") THEN 1 ELSE 0 END AS liked_by_me " +
                "FROM tb_recipe r " +
                "JOIN tb_user u ON u.userId = r.ownerUserId " +
                "WHERE r.isPublic = 'Y' AND r.isDeleted = 'N' ");

        appendSearchFilter(sql, search, false);
        appendCommonFilters(sql, cuisineStyleCd, difficultyCd, maxCookTimeMin);
        appendSortOrder(sql, sort);
        sql.append("LIMIT :limit OFFSET :offset ");

        Query query = em.createNativeQuery(sql.toString());
        query.setParameter("loginUserId", loginUserId);
        setSearchParam(query, search);
        setCommonFilterParams(query, cuisineStyleCd, difficultyCd, maxCookTimeMin);
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(this::mapToListItem).collect(Collectors.toList());
    }

    @Override
    public int countPublicRecipes(String search, String cuisineStyleCd,
                                  String difficultyCd, Integer maxCookTimeMin) {

        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(*) FROM tb_recipe r " +
                "WHERE r.isPublic = 'Y' AND r.isDeleted = 'N' ");

        appendSearchFilter(sql, search, false);
        appendCommonFilters(sql, cuisineStyleCd, difficultyCd, maxCookTimeMin);

        Query query = em.createNativeQuery(sql.toString());
        setSearchParam(query, search);
        setCommonFilterParams(query, cuisineStyleCd, difficultyCd, maxCookTimeMin);

        return ((Number) query.getSingleResult()).intValue();
    }

    @Override
    public RecipeVO findPublicRecipeById(Long recipeId, Long loginUserId) {
        String sql =
                "SELECT r.recipeId, r.ownerUserId, r.sourceType, r.externalRefId, " +
                "r.title, r.summary, r.thumbnailUrl, r.difficultyCd, r.cookTimeMin, " +
                "r.cuisineStyleCd, r.category, r.isPublic, r.isDeleted, " +
                "r.viewCnt, r.likeCnt, r.reportCnt, " +
                "r.createdId, r.createdDate, r.updatedId, r.updatedDate, " +
                "u.userNickname, u.userProfileImageUrl, " +
                "CASE WHEN EXISTS (" +
                "  SELECT 1 FROM tb_recipe_like l WHERE l.recipeId = r.recipeId AND l.userId = :loginUserId" +
                ") THEN 1 ELSE 0 END AS liked_by_me " +
                "FROM tb_recipe r " +
                "JOIN tb_user u ON u.userId = r.ownerUserId " +
                "WHERE r.recipeId = :recipeId AND r.isPublic = 'Y' AND r.isDeleted = 'N'";

        Query query = em.createNativeQuery(sql);
        query.setParameter("recipeId", recipeId);
        query.setParameter("loginUserId", loginUserId);

        Object[] row;
        try {
            row = (Object[]) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }

        RecipeVO vo = mapToRecipeVO(row);

        List<RecipeStepVO> steps = em.createQuery(
                        "SELECT s FROM RecipeStepVO s WHERE s.recipeId = :recipeId ORDER BY s.stepNo",
                        RecipeStepVO.class)
                .setParameter("recipeId", recipeId)
                .getResultList();
        vo.setRecipeSteps(steps);

        List<RecipeIngredientVO> ingredients = em.createQuery(
                        "SELECT i FROM RecipeIngredientVO i WHERE i.recipeId = :recipeId ORDER BY i.recipeIngredientId",
                        RecipeIngredientVO.class)
                .setParameter("recipeId", recipeId)
                .getResultList();
        vo.setRecipeIngredients(ingredients);

        return vo;
    }

    @Override
    public List<RecipeBoardListItemVO> findPublicRecipesOptimized(
            Long loginUserId, String search, String cuisineStyleCd,
            String difficultyCd, Integer maxCookTimeMin, String sort,
            int offset, int limit) {

        StringBuilder sql = new StringBuilder(
                "SELECT r.recipeId, r.title, r.summary, r.thumbnailUrl, " +
                "r.difficultyCd, r.cookTimeMin, r.cuisineStyleCd, r.category, " +
                "r.viewCnt, r.likeCnt, r.createdDate, r.ownerUserId, " +
                "u.userNickname, u.userProfileImageUrl, " +
                "CASE WHEN EXISTS (" +
                "  SELECT 1 FROM tb_recipe_like l WHERE l.recipeId = r.recipeId AND l.userId = :loginUserId" +
                ") THEN 1 ELSE 0 END AS liked_by_me, " +
                "GROUP_CONCAT(" +
                "  CONCAT(i.ingredientName, '::', COALESCE(i.quantityDesc, '')) " +
                "  ORDER BY i.recipeIngredientId SEPARATOR '||'" +
                ") AS ingredients_string " +
                "FROM tb_recipe r " +
                "JOIN tb_user u ON u.userId = r.ownerUserId " +
                "LEFT JOIN tb_recipe_ingredient i ON i.recipeId = r.recipeId " +
                "WHERE r.isPublic = 'Y' AND r.isDeleted = 'N' ");

        appendSearchFilter(sql, search, true);
        appendCommonFilters(sql, cuisineStyleCd, difficultyCd, maxCookTimeMin);

        sql.append("GROUP BY r.recipeId, r.title, r.summary, r.thumbnailUrl, " +
                "r.difficultyCd, r.cookTimeMin, r.cuisineStyleCd, r.category, " +
                "r.viewCnt, r.likeCnt, r.createdDate, r.ownerUserId, " +
                "u.userNickname, u.userProfileImageUrl ");

        appendSortOrder(sql, sort);
        sql.append("LIMIT :limit OFFSET :offset ");

        Query query = em.createNativeQuery(sql.toString());
        query.setParameter("loginUserId", loginUserId);
        setSearchParam(query, search);
        setCommonFilterParams(query, cuisineStyleCd, difficultyCd, maxCookTimeMin);
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(row -> {
            RecipeBoardListItemVO vo = mapToListItem(row);
            vo.setIngredientsString(row[15] != null ? (String) row[15] : null);
            return vo;
        }).collect(Collectors.toList());
    }

    // ── helper: 검색 조건 ──

    private void appendSearchFilter(StringBuilder sql, String search, boolean includeIngredient) {
        if (search != null && !search.isEmpty()) {
            sql.append("AND (LOWER(r.title) LIKE CONCAT('%', LOWER(:search), '%') ");
            sql.append("  OR LOWER(r.summary) LIKE CONCAT('%', LOWER(:search), '%') ");
            if (includeIngredient) {
                sql.append("  OR LOWER(i.ingredientName) LIKE CONCAT('%', LOWER(:search), '%') ");
            }
            sql.append(") ");
        }
    }

    private void appendCommonFilters(StringBuilder sql, String cuisineStyleCd,
                                     String difficultyCd, Integer maxCookTimeMin) {
        if (cuisineStyleCd != null && !cuisineStyleCd.isEmpty()) {
            sql.append("AND r.cuisineStyleCd = :cuisineStyleCd ");
        }
        if (difficultyCd != null && !difficultyCd.isEmpty()) {
            sql.append("AND r.difficultyCd = :difficultyCd ");
        }
        if (maxCookTimeMin != null) {
            sql.append("AND r.cookTimeMin <= :maxCookTimeMin ");
        }
    }

    private void appendSortOrder(StringBuilder sql, String sort) {
        if ("POPULAR".equals(sort)) {
            sql.append("ORDER BY r.likeCnt DESC, r.viewCnt DESC, r.createdDate DESC ");
        } else {
            sql.append("ORDER BY r.createdDate DESC ");
        }
    }

    private void setSearchParam(Query query, String search) {
        if (search != null && !search.isEmpty()) {
            query.setParameter("search", search);
        }
    }

    private void setCommonFilterParams(Query query, String cuisineStyleCd,
                                       String difficultyCd, Integer maxCookTimeMin) {
        if (cuisineStyleCd != null && !cuisineStyleCd.isEmpty()) {
            query.setParameter("cuisineStyleCd", cuisineStyleCd);
        }
        if (difficultyCd != null && !difficultyCd.isEmpty()) {
            query.setParameter("difficultyCd", difficultyCd);
        }
        if (maxCookTimeMin != null) {
            query.setParameter("maxCookTimeMin", maxCookTimeMin);
        }
    }

    // ── helper: 결과 매핑 ──

    private RecipeBoardListItemVO mapToListItem(Object[] row) {
        RecipeBoardListItemVO vo = new RecipeBoardListItemVO();
        vo.setRecipeId(toLong(row[0]));
        vo.setTitle((String) row[1]);
        vo.setSummary((String) row[2]);
        vo.setThumbnailUrl((String) row[3]);
        vo.setDifficultyCd((String) row[4]);
        vo.setCookTimeMin(toInt(row[5]));
        vo.setCuisineStyleCd((String) row[6]);
        vo.setCategory((String) row[7]);
        vo.setViewCnt(toInt(row[8]));
        vo.setLikeCnt(toInt(row[9]));
        vo.setCreatedDate(row[10] != null ? (Timestamp) row[10] : null);
        vo.setOwnerUserId(toLong(row[11]));
        vo.setAuthorNickname((String) row[12]);
        vo.setAuthorProfileImageUrl((String) row[13]);
        vo.setLikedByMe(toInt(row[14]));
        return vo;
    }

    private RecipeVO mapToRecipeVO(Object[] row) {
        RecipeVO vo = new RecipeVO();
        vo.setRecipeId(toLong(row[0]));
        vo.setOwnerUserId(toLong(row[1]));
        vo.setSourceType((String) row[2]);
        vo.setExternalRefId((String) row[3]);
        vo.setTitle((String) row[4]);
        vo.setSummary((String) row[5]);
        vo.setThumbnailUrl((String) row[6]);
        vo.setDifficultyCd((String) row[7]);
        vo.setCookTimeMin(toInt(row[8]));
        vo.setCuisineStyleCd((String) row[9]);
        vo.setCategory((String) row[10]);
        vo.setIsPublic((String) row[11]);
        vo.setIsDeleted((String) row[12]);
        vo.setViewCnt(toInt(row[13]));
        vo.setLikeCnt(toInt(row[14]));
        vo.setReportCnt(toInt(row[15]));
        vo.setCreatedId(toLong(row[16]));
        vo.setCreatedDate(row[17] != null ? (Timestamp) row[17] : null);
        vo.setUpdatedId(toLong(row[18]));
        vo.setUpdatedDate(row[19] != null ? (Timestamp) row[19] : null);
        vo.setAuthorNickname((String) row[20]);
        vo.setAuthorProfileImageUrl((String) row[21]);
        vo.setLikedByMe(toInt(row[22]));
        return vo;
    }

    private Long toLong(Object val) {
        return val != null ? ((Number) val).longValue() : null;
    }

    private Integer toInt(Object val) {
        return val != null ? ((Number) val).intValue() : null;
    }
}
