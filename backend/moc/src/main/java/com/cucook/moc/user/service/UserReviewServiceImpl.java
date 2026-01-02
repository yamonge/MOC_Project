package com.cucook.moc.user.service;

import com.cucook.moc.user.dao.UserDAO;
import com.cucook.moc.user.dao.UserReviewDAO;
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

@Service // Spring 서비스 컴포넌트로 등록
public class UserReviewServiceImpl implements UserReviewService {

    private final UserReviewDAO userReviewDAO;
    private final UserDAO userDAO; // 후기 작성자 정보(닉네임, 프로필 이미지) 조회를 위해 주입
    private final String serverBaseUrl; // 서버 base URL (프로필 이미지 URL 변환용)

    @Autowired // 생성자 주입
    public UserReviewServiceImpl(UserReviewDAO userReviewDAO,
                                 UserDAO userDAO,
                                 @Value("${server.base-url:http://localhost:8090}") String serverBaseUrl) {
        this.userReviewDAO = userReviewDAO;
        this.userDAO = userDAO;
        this.serverBaseUrl = serverBaseUrl;
    }

    /**
     * 특정 사용자에게 후기를 남깁니다. (같이 장보기 후)
     *
     * @param writerUserId 후기를 남기는 사용자의 ID
     * @param requestDTO 후기 정보를 담은 요청 DTO (targetUserId, shoppingPostId, rating, comment 포함)
     * @return 작성된 후기 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 필수 정보 누락, 이미 후기를 남긴 경우 등
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserReviewResponseDTO addUserReview(Long writerUserId, UserReviewRequestDTO requestDTO) {
        // 필수 필드 유효성 검사
        if (requestDTO.getTargetUserId() == null || requestDTO.getShoppingPostId() == null || requestDTO.getRating() == null) {
            throw new IllegalArgumentException("대상 사용자 ID, 장보기 게시글 ID, 별점은 필수입니다.");
        }
        if (requestDTO.getRating() < 1 || requestDTO.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1점에서 5점 사이여야 합니다.");
        }

        // 1. 후기 중복 확인 (UNIQUE INDEX 활용)
        if (userReviewDAO.checkIfUserReviewExists(requestDTO.getTargetUserId(), writerUserId, requestDTO.getShoppingPostId()) > 0) {
            throw new IllegalArgumentException("이미 해당 장보기에서 같은 대상에게 후기를 남겼습니다.");
        }

        // 2. Request DTO -> VO 변환 및 설정
        UserReviewVO vo = new UserReviewVO();
        vo.setTargetUserId(requestDTO.getTargetUserId());
        vo.setWriterUserId(writerUserId); // 후기를 남기는 사용자 ID 설정
        vo.setShoppingPostId(requestDTO.getShoppingPostId());
        vo.setRating(requestDTO.getRating());
        vo.setUserReviewComment(requestDTO.getUserReviewComment());
        // createdDate는 DB default 값에 맡김

        // 3. DB에 저장
        int insertedCount = userReviewDAO.insertUserReview(vo);
        if (insertedCount == 0 || vo.getUserReviewId() == null) {
            throw new RuntimeException("사용자 후기 저장에 실패했습니다.");
        }

        // 4. 🔥 평균 평점 업데이트 (대상 사용자의 rating_score)
        userDAO.updateRatingScoreByAvg(requestDTO.getTargetUserId());

        // 5. 저장된 VO를 기반으로 Response DTO 생성 및 반환
        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(writerUserId); // 작성자 정보 조회
        return UserReviewResponseDTO.from(vo, writerDetail); // 편의 메서드 사용
    }

    /**
     * 특정 사용자가 '받은' 모든 후기 목록을 조회합니다.
     * 마이페이지의 '받은 후기 목록' 탭의 목록 표시용입니다.
     *
     * @param targetUserId 후기 목록을 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 사용자가 받은 후기 목록과 총 개수를 담은 응답 DTO
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public UserReviewListResponseDTO getReceivedUserReviews(Long targetUserId) {
        List<UserReviewVO> voList = userReviewDAO.selectReceivedUserReviewsByUserId(targetUserId);

        // VO 리스트 -> DTO 리스트 변환 (작성자 정보 포함)
        List<UserReviewResponseDTO> dtoList = voList.stream()
                .map(vo -> {
                    ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(vo.getWriterUserId()); // 각 작성자 정보 조회
                    return UserReviewResponseDTO.from(vo, writerDetail);
                })
                .collect(Collectors.toList());

        return new UserReviewListResponseDTO(dtoList, dtoList.size());
    }

    /**
     * 특정 후기 ID로 단일 후기 정보를 조회합니다.
     *
     * @param reviewId 조회할 후기 ID
     * @param requestingUserId 요청을 수행하는 사용자의 ID (권한 확인용)
     * @return 상세 후기 정보를 담은 응답 DTO 또는 null (해당 후기가 없을 경우)
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserReviewResponseDTO getUserReviewDetail(Long reviewId, Long requestingUserId) {
        UserReviewVO vo = userReviewDAO.selectUserReviewById(reviewId);

        // 후기 존재 여부 확인
        if (vo == null) {
            throw new IllegalArgumentException("해당 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }

        // 권한 확인: 후기를 받은 사람(target) 또는 작성한 사람(writer)만 조회 가능
        if (!vo.getTargetUserId().equals(requestingUserId) && !vo.getWriterUserId().equals(requestingUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 조회 권한이 없습니다.");
        }

        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(vo.getWriterUserId()); // 작성자 정보 조회
        return UserReviewResponseDTO.from(vo, writerDetail);
    }

    /**
     * 특정 후기 정보를 수정합니다.
     *
     * @param reviewId 수정할 후기 ID
     * @param writerUserId 후기 작성자의 ID (권한 확인용)
     * @param requestDTO 수정할 후기 정보를 담은 요청 DTO
     * @return 수정된 후기 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public UserReviewResponseDTO updateUserReview(Long reviewId, Long writerUserId, UserReviewRequestDTO requestDTO) {
        UserReviewVO existingVo = userReviewDAO.selectUserReviewById(reviewId);

        // 후기 존재 여부 확인
        if (existingVo == null) {
            throw new IllegalArgumentException("수정할 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }

        // 권한 확인: 후기 작성자만 수정 가능
        if (!existingVo.getWriterUserId().equals(writerUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 수정 권한이 없습니다.");
        }

        // DTO -> VO 업데이트
        Optional.ofNullable(requestDTO.getRating()).filter(r -> r >= 1 && r <= 5).ifPresent(existingVo::setRating);
        Optional.ofNullable(requestDTO.getUserReviewComment()).ifPresent(existingVo::setUserReviewComment);
        // targetUserId, writerUserId, shoppingPostId, createdDate는 수정 불가

        int updatedCount = userReviewDAO.updateUserReview(existingVo);
        if (updatedCount == 0) {
            throw new RuntimeException("후기 정보 수정에 실패했습니다.");
        }

        ReviewedUserDetailDTO writerDetail = getReviewedUserDetailDTO(existingVo.getWriterUserId()); // 작성자 정보 조회
        return UserReviewResponseDTO.from(existingVo, writerDetail);
    }

    /**
     * 특정 후기 정보를 삭제합니다.
     *
     * @param reviewId 삭제할 후기 ID
     * @param writerUserId 삭제를 요청하는 사용자의 ID (권한 확인용)
     * @return 삭제 성공 여부 (true/false)
     * @throws IllegalArgumentException 해당 후기를 찾을 수 없거나 권한이 없을 경우
     */
    @Override
    @Transactional // 데이터 변경 트랜잭션 적용
    public boolean deleteUserReview(Long reviewId, Long writerUserId) {
        // 1. 삭제 전 권한 확인
        UserReviewVO existingVo = userReviewDAO.selectUserReviewById(reviewId);
        if (existingVo == null) {
            throw new IllegalArgumentException("삭제할 후기를 찾을 수 없습니다. (Review ID: " + reviewId + ")");
        }
        // 권한 확인: 후기 작성자만 삭제 가능
        if (!existingVo.getWriterUserId().equals(writerUserId)) {
            throw new IllegalArgumentException("이 후기 (ID: " + reviewId + ")에 대한 삭제 권한이 없습니다.");
        }

        // 2. DB에서 삭제
        int deletedCount = userReviewDAO.deleteUserReview(reviewId, writerUserId); // DAO 메서드에 writerUserId도 전달
        return deletedCount > 0;
    }

    /**
     * 특정 사용자가 '받은' 후기의 총 개수를 조회합니다.
     * 마이페이지 '받은 후기 목록' 카드에 표시용입니다.
     *
     * @param targetUserId 개수를 조회할 사용자의 ID (후기를 받은 사람의 ID)
     * @return 받은 후기의 총 개수
     */
    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션 적용
    public int countReceivedUserReviews(Long targetUserId) {
        return userReviewDAO.countReceivedUserReviewsByUserId(targetUserId);
    }

    /**
     * 후기 작성 사용자 정보를 조회하여 ReviewedUserDetailDTO로 반환하는 헬퍼 메서드.
     * @param userId 조회할 사용자의 ID
     * @return ReviewedUserDetailDTO
     */
    private ReviewedUserDetailDTO getReviewedUserDetailDTO(Long userId) {
        if (userId == null) {
            return new ReviewedUserDetailDTO(null, "알 수 없음", null);
        }

        try {
            // UserDAO를 통해 실제 사용자 정보 조회
            ReviewedUserDetailDTO userDetail = userDAO.selectReviewedUserDetail(userId);
            
            if (userDetail != null) {
                // 프로필 이미지 URL 변환 (상대 경로 → 절대 URL)
                String profileImageUrl = userDetail.getProfileImageUrl();
                if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
                    // 이미 절대 URL이면 그대로, 상대 경로면 절대 URL로 변환
                    if (!profileImageUrl.startsWith("http://") && !profileImageUrl.startsWith("https://")) {
                        userDetail.setProfileImageUrl(serverBaseUrl + profileImageUrl);
                    }
                }
                return userDetail;
            }
            
            // 사용자를 찾지 못한 경우 기본값 반환
            return new ReviewedUserDetailDTO(userId, "알 수 없음", null);
        } catch (Exception e) {
            // 조회 중 예외 발생 시 기본값 반환
            return new ReviewedUserDetailDTO(userId, "알 수 없음", null);
        }
    }
}