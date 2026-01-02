package com.cucook.moc.recipe.dao;

import com.cucook.moc.recipe.vo.RecipeReportVO; // VO 임포트
import org.apache.ibatis.annotations.Mapper; // `@Mapper` 어노테이션
import org.apache.ibatis.annotations.Param; // 복수 파라미터 매핑을 위해 `@Param` 사용

import java.util.List;
import java.util.Map;

@Mapper // Spring에서 MyBatis 매퍼로 인식하도록 어노테이션 추가
public interface RecipeReportDAO {

    /**
     * 특정 사용자가 '신고한' 모든 레시피 신고 목록을 조회합니다.
     * `RecipeReportMapper.xml`의 `<select id="selectReportedRecipesByReporterUserId">`와 매핑됩니다.
     * (마이페이지 '신고 내역' (레시피) 탭 표시용)
     *
     * @param reporterUserId 조회할 사용자의 ID (신고한 사람의 ID)
     * @return 해당 사용자가 신고한 RecipeReportVO 리스트
     */
    List<RecipeReportVO> selectReportedRecipesByReporterUserId(Long reporterUserId);

    /**
     * 특정 사용자가 '신고한' 레시피 신고의 총 개수를 조회합니다.
     * `RecipeReportMapper.xml`의 `<select id="countReportedRecipesByReporterUserId">`와 매핑됩니다.
     * (마이페이지 '신고 내역' 카드에 표시용)
     *
     * @param reporterUserId 조회할 사용자의 ID (신고한 사람의 ID)
     * @return 신고된 레시피 신고의 총 개수
     */
    int countReportedRecipesByReporterUserId(Long reporterUserId);

    /**
     * 레시피 신고 정보를 데이터베이스에 저장합니다.
     * `RecipeReportMapper.xml`의 `<insert id="insertRecipeReport">`와 매핑됩니다.
     * (레시피 상세 화면에서 '신고하기' 버튼 클릭 시 사용)
     *
     * @param vo 저장할 RecipeReportVO 객체
     * @return 삽입된 레코드 수
     */
    int insertRecipeReport(RecipeReportVO vo);

    /**
     * 특정 레시피와 특정 사용자의 신고 기록이 이미 존재하는지 확인합니다.
     * `RecipeReportMapper.xml`의 `<select id="checkIfRecipeReportExists">`와 매핑됩니다.
     * (중복 신고 방지용)
     *
     * @param recipeId 확인할 레시피의 ID
     * @param reporterUserId 확인할 신고한 사용자의 ID
     * @return 신고 기록이 존재하면 1, 아니면 0
     */
    int checkIfRecipeReportExists(
            @Param("recipeId") Long recipeId,
            @Param("reporterUserId") Long reporterUserId);

    /**
     * 특정 레시피 신고 ID로 단일 신고 정보를 조회합니다.
     * `RecipeReportMapper.xml`의 `<select id="selectRecipeReportById">`와 매핑됩니다.
     * (관리자/개발자용 또는 신고 수정/삭제 전 존재 여부 확인용)
     *
     * @param reportId 조회할 신고 ID
     * @return 해당 신고의 RecipeReportVO 객체 또는 null
     */
    RecipeReportVO selectRecipeReportById(Long reportId);

    /**
     * 특정 레시피 신고 정보를 수정합니다.
     * `RecipeReportMapper.xml`의 `<update id="updateRecipeReport">`와 매핑됩니다.
     * (관리자 또는 신고한 사용자 본인이 수정할 때 사용)
     *
     * @param vo 수정할 RecipeReportVO 객체 (reportId, reporterUserId 포함)
     * @return 수정된 레코드 수
     */
    int updateRecipeReport(RecipeReportVO vo);

    /**
     * 특정 레시피 신고 기록을 삭제합니다.
     * `RecipeReportMapper.xml`의 `<delete id="deleteRecipeReport">`와 매핑됩니다.
     * (관리자 또는 신고한 사용자 본인이 삭제할 때 사용)
     *
     * @param reportId 삭제할 신고 ID
     * @param reporterUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제된 레코드 수
     */
    int deleteRecipeReport(@Param("reportId") Long reportId, @Param("reporterUserId") Long reporterUserId);

    /**
     * 레시피 신고 상태를 업데이트합니다. (관리자용)
     * 
     * @param recipeReportId 신고 ID
     * @param statusCd 상태 코드 (PENDING, PROCESSED 등)
     * @return 업데이트된 레코드 수
     */
    int updateRecipeReportStatus(
            @Param("recipeReportId") Long recipeReportId, 
            @Param("statusCd") String statusCd
    );
}