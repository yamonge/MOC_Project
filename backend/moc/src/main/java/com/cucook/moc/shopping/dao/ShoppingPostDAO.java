package com.cucook.moc.shopping.dao;

import com.cucook.moc.shopping.dto.ShoppingPostDetailProjection;
import com.cucook.moc.shopping.dto.ShoppingPostSummaryDTO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ShoppingPostDAO extends JpaRepository<ShoppingPostVO, Long> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tb_shopping_post_category (shopping_post_id, category_cd) " +
            "VALUES (:shoppingPostId, :categoryCode)", nativeQuery = true)
    void insertPostCategory(@Param("shoppingPostId") Long shoppingPostId,
                            @Param("categoryCode") String categoryCode);

    @Query(value = "SELECT " +
            "sp.shopping_post_id AS shoppingPostId, " +
            "sp.place_name AS placeName, " +
            "sp.place_address AS placeAddress, " +
            "sp.latitude AS latitude, " +
            "sp.longitude AS longitude, " +
            "sp.meet_datetime AS meetDatetime, " +
            "sp.max_person_cnt AS maxPersonCnt, " +
            "sp.current_person_cnt AS currentPersonCnt, " +
            "sp.status_cd AS statusCd, " +
            "sp.writer_user_id AS writerUserId, " +
            "u.user_nickname AS writerNickname, " +
            "sp.created_date AS createdDate, " +
            "sp.description AS description, " +
            "( SELECT GROUP_CONCAT(spc.category_cd ORDER BY spc.category_cd) " +
            "  FROM tb_shopping_post_category spc " +
            "  WHERE spc.shopping_post_id = sp.shopping_post_id " +
            ") AS categoryCodesCsv, " +
            "( 6371000 * ACOS( " +
            "  COS(RADIANS(:centerLat)) * COS(RADIANS(sp.latitude)) " +
            "  * COS(RADIANS(sp.longitude) - RADIANS(:centerLng)) " +
            "  + SIN(RADIANS(:centerLat)) * SIN(RADIANS(sp.latitude)) " +
            ") ) AS distanceMeters " +
            "FROM tb_shopping_post sp " +
            "LEFT JOIN tb_user u ON u.user_id = sp.writer_user_id " +
            "WHERE sp.latitude BETWEEN :latMin AND :latMax " +
            "AND sp.longitude BETWEEN :lngMin AND :lngMax " +
            "ORDER BY sp.created_date DESC", nativeQuery = true)
    List<ShoppingPostSummaryDTO> selectNearbyPosts(
            @Param("centerLat") double centerLat,
            @Param("centerLng") double centerLng,
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax
    );

    @Query(value = "SELECT " +
            "sp.shopping_post_id AS shoppingPostId, " +
            "sp.place_name AS placeName, " +
            "sp.place_address AS placeAddress, " +
            "sp.latitude AS latitude, " +
            "sp.longitude AS longitude, " +
            "sp.meet_datetime AS meetDatetime, " +
            "sp.max_person_cnt AS maxPersonCnt, " +
            "sp.current_person_cnt AS currentPersonCnt, " +
            "sp.status_cd AS statusCd, " +
            "sp.writer_user_id AS writerUserId, " +
            "u.user_nickname AS writerNickname, " +
            "sp.created_date AS createdDate, " +
            "sp.description AS description, " +
            "( SELECT GROUP_CONCAT(spc.category_cd ORDER BY spc.category_cd) " +
            "  FROM tb_shopping_post_category spc " +
            "  WHERE spc.shopping_post_id = sp.shopping_post_id " +
            ") AS categoryCodesCsv, " +
            "0 AS distanceMeters, " +
            "CASE WHEN EXISTS ( " +
            "  SELECT 1 FROM tb_shopping_chat_room r " +
            "  JOIN tb_shopping_participant p ON r.chat_room_id = p.chat_room_id " +
            "  WHERE r.shopping_post_id = sp.shopping_post_id " +
            "    AND p.user_id = :userId AND p.leave_date IS NULL " +
            ") THEN 1 ELSE 0 END AS isParticipated " +
            "FROM tb_shopping_post sp " +
            "LEFT JOIN tb_user u ON u.user_id = sp.writer_user_id " +
            "WHERE sp.latitude BETWEEN :latMin AND :latMax " +
            "AND sp.longitude BETWEEN :lngMin AND :lngMax " +
            "AND sp.status_cd = 'OPEN' " +
            "ORDER BY sp.created_date DESC", nativeQuery = true)
    List<ShoppingPostSummaryDTO> selectPostsByPlace(
            @Param("centerLat") double centerLat,
            @Param("centerLng") double centerLng,
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax,
            @Param("userId") Long userId
    );

    @Query(value = "SELECT " +
            "sp.shopping_post_id AS shoppingPostId, " +
            "sp.writer_user_id AS writerUserId, " +
            "u.user_nickname AS writerNickname, " +
            "sp.place_name AS placeName, " +
            "sp.place_address AS placeAddress, " +
            "sp.latitude AS latitude, " +
            "sp.longitude AS longitude, " +
            "sp.meet_datetime AS meetDatetime, " +
            "sp.min_person_cnt AS minPersonCnt, " +
            "sp.max_person_cnt AS maxPersonCnt, " +
            "sp.current_person_cnt AS currentPersonCnt, " +
            "sp.status_cd AS statusCd, " +
            "sp.description AS description " +
            "FROM tb_shopping_post sp " +
            "LEFT JOIN tb_user u ON u.user_id = sp.writer_user_id " +
            "WHERE sp.shopping_post_id = :shoppingPostId", nativeQuery = true)
    ShoppingPostDetailProjection selectPostDetail(@Param("shoppingPostId") Long shoppingPostId);

    @Query(value = "SELECT category_cd FROM tb_shopping_post_category " +
            "WHERE shopping_post_id = :shoppingPostId " +
            "ORDER BY shopping_post_category_id ASC", nativeQuery = true)
    List<String> selectCategoryCodesByPostId(@Param("shoppingPostId") Long shoppingPostId);

    @Query("SELECT s.writerUserId FROM ShoppingPostVO s WHERE s.shoppingPostId = :postId")
    Long selectOwnerUserId(@Param("postId") Long postId);

    @Modifying
    @Transactional
    @Query("UPDATE ShoppingPostVO s SET s.statusCd = :statusCd, s.updatedDate = CURRENT_TIMESTAMP " +
            "WHERE s.shoppingPostId = :postId")
    int updateStatus(@Param("postId") Long postId, @Param("statusCd") String statusCd);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tb_shopping_post SET status_cd = 'DONE', updated_date = CURRENT_TIMESTAMP " +
            "WHERE meet_datetime < CURRENT_TIMESTAMP AND status_cd = 'OPEN'", nativeQuery = true)
    int bulkUpdateExpiredPosts();
}
