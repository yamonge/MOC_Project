package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.IngredientUseHistVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper // Spring에서 MyBatis 매퍼로 인식하도록 어노테이션 추가
public interface IngredientUseHistDAO {

    /**
     * 재료 사용 이력 정보를 데이터베이스에 저장합니다.
     * `IngredientUseHistMapper.xml`의 `<insert id="insertIngredientUseHist">`와 매핑됩니다.
     * (레시피 시작 시 재료 소비 처리 로직에서 호출)
     *
     * @param vo 저장할 IngredientUseHistVO 객체
     * @return 삽입된 레코드 수
     */
    int insertIngredientUseHist(IngredientUseHistVO vo);

    /**
     * 특정 사용자의 재료 사용 이력 목록을 조회합니다.
     * `IngredientUseHistMapper.xml`의 `<select id="selectIngredientUseHistsByUserId">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 IngredientUseHistVO 리스트
     */
    List<IngredientUseHistVO> selectIngredientUseHistsByUserId(Long userId);

    /**
     * 특정 사용자 재료(`tb_user_ingredient`)에 대한 사용 이력 목록을 조회합니다.
     * `IngredientUseHistMapper.xml`의 `<select id="selectIngredientUseHistsByUserIngredientId">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param userIngredientId 조회할 사용자 재료의 ID
     * @return 해당 사용자 재료의 IngredientUseHistVO 리스트
     */
    List<IngredientUseHistVO> selectIngredientUseHistsByUserIngredientId(Long userIngredientId);

    /**
     * 특정 사용자가 특정 레시피에서 사용한 재료 이력을 조회합니다.
     * `IngredientUseHistMapper.xml`의 `<select id="selectIngredientUseHistsByRecipeAndUser">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param userId 조회할 사용자의 ID
     * @param recipeId 조회할 레시피의 ID
     * @return 해당 레시피와 사용자 조합의 IngredientUseHistVO 리스트
     */
    List<IngredientUseHistVO> selectIngredientUseHistsByRecipeAndUser(
            @Param("userId") Long userId,
            @Param("recipeId") Long recipeId);

    /**
     * 특정 사용자가 기록한 모든 재료 사용 이력의 총 개수를 조회합니다.
     * `IngredientUseHistMapper.xml`의 `<select id="countIngredientUseHistsByUserId">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param userId 개수를 조회할 사용자의 ID
     * @return 재료 사용 이력의 총 개수
     */
    int countIngredientUseHistsByUserId(Long userId);

    /**
     * 특정 재료 사용 이력 기록을 삭제합니다.
     * `IngredientUseHistMapper.xml`의 `<delete id="deleteIngredientUseHist">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param ingredientUseHistId 삭제할 이력의 ID
     * @return 삭제된 레코드 수
     */
    int deleteIngredientUseHist(Long ingredientUseHistId);

    /**
     * 특정 레시피와 관련된 사용자의 모든 재료 이력을 삭제합니다.
     * `IngredientUseHistMapper.xml`의 `<delete id="deleteIngredientUseHistsByRecipeAndUser">`와 매핑됩니다.
     * (개발자/관리자용)
     *
     * @param userId 삭제할 사용자의 ID
     * @param recipeId 삭제할 레시피의 ID
     * @return 삭제된 레코드 수
     */
    int deleteIngredientUseHistsByRecipeAndUser(
            @Param("userId") Long userId,
            @Param("recipeId") Long recipeId);

    /**
     * 특정 재료 사용 이력 ID로 단일 이력 정보를 조회합니다.
     * (삭제 전 존재 여부 확인용 등)
     * `IngredientUseHistMapper.xml`의 `<select id="selectIngredientUseHistById">`와 매핑됩니다.
     *
     * @param ingredientUseHistId 조회할 이력의 ID
     * @return 해당 이력의 IngredientUseHistVO 객체 또는 null
     */
    IngredientUseHistVO selectIngredientUseHistById(Long ingredientUseHistId);
}