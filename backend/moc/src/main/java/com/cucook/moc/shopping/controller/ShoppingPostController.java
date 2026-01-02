package com.cucook.moc.shopping.controller;

import com.cucook.moc.shopping.dto.ShoppingPostCreateRequestDTO;
import com.cucook.moc.shopping.dto.ShoppingPostDetailDTO;
import com.cucook.moc.shopping.dto.ShoppingPostSummaryDTO;
import com.cucook.moc.shopping.service.ShoppingPostJoinService;
import com.cucook.moc.shopping.service.ShoppingPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-posts")
public class ShoppingPostController {

    private final ShoppingPostService shoppingPostService;
    private final ShoppingPostJoinService shoppingPostJoinService;

    public ShoppingPostController(ShoppingPostService shoppingPostService,
                                  ShoppingPostJoinService shoppingPostJoinService) {
        this.shoppingPostService = shoppingPostService;
        this.shoppingPostJoinService = shoppingPostJoinService;
    }

    @PostMapping
    public ResponseEntity<Long> createPost(
            @RequestParam("userId") Long userId,
            @RequestBody ShoppingPostCreateRequestDTO dto
    ) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        Long postId = shoppingPostService.createPost(userId, dto);
        return ResponseEntity.ok(postId);
    }

    /**
     * 주변 게시글 목록 (맵 기준)
     * GET /api/shopping/posts/nearby?lat=37.5&lng=127.0
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<ShoppingPostSummaryDTO>> getNearbyPosts(
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng
    ) {
        return ResponseEntity.ok(shoppingPostService.getNearbyPosts(lat, lng));
    }

    /**
     * 게시글 상세
     * GET /api/shopping/posts/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<ShoppingPostDetailDTO> getPostDetail(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(shoppingPostService.getPostDetail(postId));
    }
    /**
     * 게시글 채팅 참여
     * GET /api/shopping/posts/{postId}/join
     */
    @PostMapping("/{postId}/join")
    public ResponseEntity<Long> joinPost(
            @PathVariable Long postId,
            @RequestParam("userId") Long userId
    ) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        Long chatRoomId = shoppingPostJoinService.joinPost(postId, userId);
        return ResponseEntity.ok(chatRoomId);
    }

    /**
     * 특정 마트(핀) 기준 게시글 목록
     * GET /api/shopping-posts/place?lat=37.5&lng=127.0&userId=1
     * - axiosConfig가 ?userId= 를 자동으로 붙여줌
     */
    @GetMapping("/place")
    public ResponseEntity<List<ShoppingPostSummaryDTO>> getPostsByPlace(
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng,
            @RequestParam("userId") Long userId
    ) {
        List<ShoppingPostSummaryDTO> list = shoppingPostService.getPostsForPlace(lat, lng, userId);
        return ResponseEntity.ok(list);
    }
}