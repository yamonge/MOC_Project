package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserRepository;
import com.cucook.moc.user.dao.UserReviewRepository;
import com.cucook.moc.user.dto.request.UserReviewRequestDTO;
import com.cucook.moc.user.dto.ReviewedUserDetailDTO;
import com.cucook.moc.user.dto.response.UserReviewListResponseDTO;
import com.cucook.moc.user.dto.response.UserReviewResponseDTO;
import com.cucook.moc.user.vo.UserReviewVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserReviewServiceImpl implements UserReviewService {

    private final UserReviewRepository userReviewRepository;
    private final UserRepository userRepository;
    private final String serverBaseUrl;

    @Autowired
    public UserReviewServiceImpl(UserReviewRepository userReviewRepository,
                                 UserRepository userRepository,
                                 @Value("${server.base-url:http://localhost:8090}") String serverBaseUrl) {
        this.userReviewRepository = userReviewRepository;
        this.userRepository = userRepository;
        this.serverBaseUrl = serverBaseUrl;
    }

    @Override
    @Transactional
    public UserReviewResponseDTO addUserReview(Long writerUserId, UserReviewRequestDTO requestDTO) {
        if (requestDTO.getTargetUserId() == null || requestDTO.getShoppingPostId() == null || requestDTO.getRating() == null) {
            throw new IllegalArgumentException("대상 사용자 ID, 장보기 게시글 ID, 별점은 필수입니다.");
        }
        if (writerUserId.equals(requestDTO.getTargetUserId())) {
            throw new IllegalArgumentException("자기 자신에게 리뷰를 작성할 수 없습니다.");
        }
        if (requestDTO.getRating() < 1 || requestDTO.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1점에서 5점 사이여야 합니다.");
        }

        if (userReviewRepository.existsByTargetUserIdAndWriterUserIdAndShoppingPostId(
                requestDTO.getTargetUserId(), writerUserId, requestDTO.getShoppingPostId())) {
            throw new IllegalArgumentException("이미 해당 장보기에서 같은 대상에게 후기를 남겼습니다.");
        }

        UserReviewVO vo = new UserReviewVO();
        vo.setTargetUserId(requestDTO.getTargetUserId());
        vo.setWriterUserId(writerUserId);
        vo.setShoppingPostId(requestDTO.getShoppingPostId());
        vo.setRating(requestDTO.getRating());
        vo.setUserReviewComment(requestDTO.getUserReviewComment());

        vo = userReviewRepository.save(vo);

        userRepository.updateRatingScoreByAvg(requestDTO.getTargetUserId());

        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(writerUserId);
        return UserReviewResponseDTO.from(vo, writerDetail);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReviewListResponseDTO getReceivedUserReviews(Long targetUserId) {
        List<UserReviewVO> voList = userReviewRepository.findByTargetUserId(targetUserId);

        List<UserReviewResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(vo.getWriterUserId());
                    return UserReviewResponseDTO.from(vo, writerDetail);
                })
                .collect(Collectors.toList());

        return new UserReviewListResponseDTO(dtoList, dtoList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public UserReviewResponseDTO getUserReviewDetail(Long reviewId, Long requestingUserId) {
        UserReviewVO vo = userReviewRepository.findById(reviewId).orElse(null);

        if (vo == null) {
            throw new IllegalArgumentException("해당 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }

        if (!vo.getTargetUserId().equals(requestingUserId) && !vo.getWriterUserId().equals(requestingUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 조회 권한이 없습니다.");
        }

        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(vo.getWriterUserId());
        return UserReviewResponseDTO.from(vo, writerDetail);
    }

    @Override
    @Transactional
    public UserReviewResponseDTO updateUserReview(Long reviewId, Long writerUserId, UserReviewRequestDTO requestDTO) {
        UserReviewVO existingVo = userReviewRepository.findById(reviewId).orElse(null);

        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }

        if (!existingVo.getWriterUserId().equals(writerUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 수정 권한이 없습니다.");
        }

        Optional.ofNullable(requestDTO.getRating()).filter(r -> r >= 1 && r <= 5).ifPresent(existingVo::setRating);
        Optional.ofNullable(requestDTO.getUserReviewComment()).ifPresent(existingVo::setUserReviewComment);

        existingVo = userReviewRepository.save(existingVo);

        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(existingVo.getWriterUserId());
        return UserReviewResponseDTO.from(existingVo, writerDetail);
    }

    @Override
    @Transactional
    public boolean deleteUserReview(Long reviewId, Long writerUserId) {
        UserReviewVO existingVo = userReviewRepository.findById(reviewId).orElse(null);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }
        if (!existingVo.getWriterUserId().equals(writerUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 삭제 권한이 없습니다.");
        }

        int deletedCount = userReviewRepository.deleteByUserReviewIdAndWriterUserId(reviewId, writerUserId);
        return deletedCount > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public int countReceivedUserReviews(Long targetUserId) {
        return userReviewRepository.countByTargetUserId(targetUserId);
    }

    private ReviewedUserDetailDTO getReviewedUserDetailDTO(Long userId) {
        if (userId == null) {
            return new ReviewedUserDetailDTO(null, "알 수 없음", null);
        }

        try {
            ReviewedUserDetailDTO userDetail = userRepository.selectReviewedUserDetail(userId);
            
            if (userDetail != null) {
                String profileImageUrl = userDetail.getProfileImageUrl();
                if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
                    if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                        userDetail.setProfileImageUrl(serverBaseUrl + profileImageUrl);
                    }
                }
                return userDetail;
            }
            
            return new ReviewedUserDetailDTO(userId, "알 수 없음", null);
        } catch (Exception e) {
            return new ReviewedUserDetailDTO(userId, "알 수 없음", null);
        }
    }
}
