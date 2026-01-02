package com.cucook.moc.shopping.dao;

import com.cucook.moc.shopping.dto.ShoppingPostDetailDTO;
import com.cucook.moc.shopping.dto.ShoppingPostSummaryDTO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ShoppingPostDAO {

    // 게시글 저장
    void insertPost(ShoppingPostVO post);

    // 게시글 카테고리 저장 (사용할 경우)
    void insertPostCategory(
            @Param("shoppingPostId") Long shoppingPostId,
            @Param("categoryCode") String categoryCode
    );

    // 반경 내 게시글 목록
    List<ShoppingPostSummaryDTO> selectNearbyPosts(
            @Param("centerLat") double centerLat,
            @Param("centerLng") double centerLng,
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax
    );
    
    // ✅ 특정 마트(좌표) 기준으로 글 목록 조회
    List<ShoppingPostSummaryDTO> selectPostsByPlace(
            @Param("centerLat") double centerLat,
            @Param("centerLng") double centerLng,
            @Param("latMin") double latMin,
            @Param("latMax") double latMax,
            @Param("lngMin") double lngMin,
            @Param("lngMax") double lngMax,
            @Param("userId") Long userId
    );

    // 상세보기
    ShoppingPostDetailDTO selectPostDetail(@Param("shoppingPostId") Long shoppingPostId);

    // 카테고리 조회
    List<String> selectCategoryCodesByPostId(@Param("shoppingPostId") Long shoppingPostId);

    // 리뷰/DONE 체크용: 게시글 단건 조회
    ShoppingPostVO selectById(@Param("postId") Long postId);

    // 게시글 작성자 조회 (방장 권한 검증용)
    Long selectOwnerUserId(@Param("postId") Long postId);

    // 게시글 상태 업데이트
    int updateStatus(@Param("postId") Long postId, @Param("statusCd") String statusCd);

    // 만료된 게시글 일괄 업데이트
    int bulkUpdateExpiredPosts();
}

