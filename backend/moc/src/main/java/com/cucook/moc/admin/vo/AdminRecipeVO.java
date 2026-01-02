package com.cucook.moc.admin.vo;

import lombok.*;
import java.sql.Timestamp;

/**
 * 레시피(게시글) 관리 VO
 * - 기본 컬럼: tb_recipe
 * - ownerNickname 은 tb_user 조인 결과의 별칭
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminRecipeVO {

    // tb_recipe.recipe_id
    private Long recipeId;

    // tb_recipe.owner_user_id
    private Long ownerUserId;

    // tb_recipe.title
    private String title;

    // tb_recipe.is_public (Y/N)
    private String isPublic;

    // tb_recipe.is_deleted (Y/N)
    private String isDeleted;

    // tb_recipe.report_cnt
    private Integer reportCnt;

    // tb_recipe.created_date
    private Timestamp createdDate;

    // tb_user.user_nickname (JOIN 해서 alias 로 가져옴)
    private String ownerNickname;
}
