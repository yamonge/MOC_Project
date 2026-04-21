package com.cucook.moc.shopping.service;

import com.cucook.moc.shopping.dao.ShoppingPostDAO;
import com.cucook.moc.shopping.dto.ShoppingPostCreateRequestDTO;
import com.cucook.moc.shopping.dto.ShoppingPostDetailDTO;
import com.cucook.moc.shopping.dto.ShoppingPostDetailProjection;
import com.cucook.moc.shopping.dto.ShoppingPostSummaryDTO;
import com.cucook.moc.shopping.vo.ShoppingPostVO;
import com.cucook.moc.chat.service.ShoppingChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
@Transactional
public class ShoppingPostService {

    @Autowired
    private ShoppingPostDAO shoppingPostDAO;

    @Autowired
    private ShoppingChatRoomService shoppingChatRoomService;

    /**
     * 글 생성 + 카테고리 + 채팅방 생성
     */
    public Long createPost(Long writerUserId, ShoppingPostCreateRequestDTO dto) {

        Integer personCntMax = dto.getMaxPersonCnt();

        if (personCntMax == null) personCntMax = 2;
        if (personCntMax < 2) throw new IllegalArgumentException("최대 인원은 2명 이상이어야 합니다.");
        if (personCntMax > 5) throw new IllegalArgumentException("최대 인원은 5명을 초과할 수 없습니다.");
        if (dto.getMeetDateTime() == null) {
            throw new IllegalArgumentException("meetDateTime은 필수입니다. (epoch millis)");
        }

        Timestamp meetTs = new Timestamp(dto.getMeetDateTime());
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        Timestamp oneHourLater = new Timestamp(now.getTime() + (60 * 60 * 1000));
        
        if (meetTs.before(oneHourLater)) {
            throw new IllegalArgumentException("만날 시간은 현재 시간으로부터 최소 1시간 이후여야 합니다.");
        }

        ShoppingPostVO postVO = new ShoppingPostVO();
        postVO.setWriterUserId(writerUserId);
        postVO.setMeetDatetime(meetTs);
        postVO.setMinPersonCnt(dto.getMinPersonCnt() != null ? dto.getMinPersonCnt() : 2);
        postVO.setMaxPersonCnt(dto.getMaxPersonCnt());
        postVO.setCurrentPersonCnt(1);
        postVO.setDescription(dto.getDescription());
        postVO.setStatusCd("OPEN");

        postVO.setPlaceName(dto.getPlaceName());
        postVO.setPlaceAddress(dto.getPlaceAddress());
        postVO.setLatitude(dto.getLatitude());
        postVO.setLongitude(dto.getLongitude());

        postVO.setCreatedId(writerUserId);

        ShoppingPostVO saved = shoppingPostDAO.save(postVO);
        Long postId = saved.getShoppingPostId();

        if (dto.getCategoryCodes() != null) {
            for (String cd : dto.getCategoryCodes()) {
                shoppingPostDAO.insertPostCategory(postId, cd);
            }
        }

        shoppingChatRoomService.createRoomForPost(postId, writerUserId);

        return postId;
    }

    /**
     * 현재 위치 기준 주변 게시글
     */
    @Transactional(readOnly = true)
    public List<ShoppingPostSummaryDTO> getNearbyPosts(double lat, double lng) {
        double latDiff = 0.03;
        double lngDiff = 0.03;

        double latMin = lat - latDiff;
        double latMax = lat + latDiff;
        double lngMin = lng - lngDiff;
        double lngMax = lng + lngDiff;

        return shoppingPostDAO.selectNearbyPosts(lat, lng, latMin, latMax, lngMin, lngMax);
    }

    /**
     * 특정 마트(핀) 기준 게시글 목록
     */
    @Transactional(readOnly = true)
    public List<ShoppingPostSummaryDTO> getPostsForPlace(double lat, double lng, Long userId) {
        double latDiff = 0.001;
        double lngDiff = 0.001;

        double latMin = lat - latDiff;
        double latMax = lat + latDiff;
        double lngMin = lng - lngDiff;
        double lngMax = lng + lngDiff;

        return shoppingPostDAO.selectPostsByPlace(lat, lng, latMin, latMax, lngMin, lngMax, userId);
    }

    @Transactional(readOnly = true)
    public ShoppingPostDetailDTO getPostDetail(Long postId) {
        ShoppingPostDetailProjection p = shoppingPostDAO.selectPostDetail(postId);
        if (p == null) return null;

        ShoppingPostDetailDTO detail = new ShoppingPostDetailDTO();
        detail.setShoppingPostId(p.getShoppingPostId());
        detail.setWriterUserId(p.getWriterUserId());
        detail.setWriterNickname(p.getWriterNickname());
        detail.setPlaceName(p.getPlaceName());
        detail.setPlaceAddress(p.getPlaceAddress());
        detail.setLatitude(p.getLatitude());
        detail.setLongitude(p.getLongitude());
        detail.setMeetDatetime(p.getMeetDatetime());
        detail.setMinPersonCnt(p.getMinPersonCnt());
        detail.setMaxPersonCnt(p.getMaxPersonCnt());
        detail.setCurrentPersonCnt(p.getCurrentPersonCnt());
        detail.setStatusCd(p.getStatusCd());
        detail.setDescription(p.getDescription());
        detail.setCategoryCodes(shoppingPostDAO.selectCategoryCodesByPostId(postId));
        return detail;
    }

    @Transactional(readOnly = true)
    public ShoppingPostVO getPost(Long postId) {
        return shoppingPostDAO.findById(postId).orElse(null);
    }
}
