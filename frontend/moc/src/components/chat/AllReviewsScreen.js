import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {ChevronLeft, Star} from 'lucide-react-native';
import {getUserReviews, getPublicProfile} from '../../api/chat';
import styles from '../../styles/components/chat/AllReviewsScreenStyles';

const AllReviewsScreen = ({visible, onClose, participant}) => {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  // 후기 데이터 로드
  useEffect(() => {
    const fetchAllReviews = async () => {
      if (!visible || !participant?.userId) return;

      setLoading(true);
      try {
        console.log('📝 [전체후기] 데이터 로드 시작:', participant.userId);

        // 프로필 및 전체 후기 조회
        const [profile, reviews] = await Promise.all([
          getPublicProfile(participant.userId),
          getUserReviews(participant.userId), // limit 없이 전체 조회
        ]);

        // 후기 날짜 계산
        const getRelativeTime = dateString => {
          if (!dateString) return '';
          const now = new Date();
          const date = new Date(dateString);
          const diffMs = now - date;
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return '오늘';
          if (diffDays === 1) return '어제';
          if (diffDays < 7) return `${diffDays}일 전`;
          if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
          return `${Math.floor(diffDays / 30)}개월 전`;
        };

        // 첫 글자 추출 함수
        const getInitial = name => {
          if (!name) return '?';
          return name.charAt(0);
        };

        setReviewData({
          nickname: profile.userNickname || participant.nickname || '사용자',
          rating: profile.ratingScore || 0,
          totalReviews: profile.reviewCnt || 0,
          reviews: Array.isArray(reviews)
            ? reviews.map((review, index) => ({
                id: review.userReviewId || index,
                author: review.writerNickname || '익명',
                authorInitial: getInitial(review.writerNickname),
                authorProfileImageUrl: review.writerProfileImageUrl || null,
                rating: review.rating || 5,
                date: getRelativeTime(review.createdDate),
                content: review.comment || '',
              }))
            : [],
        });

        console.log('✅ [전체후기] 데이터 로드 완료:', reviews.length, '개');
      } catch (error) {
        console.error('❌ [전체후기] 데이터 로드 실패:', error);
        // 에러 시 기본값 설정
        setReviewData({
          nickname: participant.nickname || '사용자',
          rating: 0,
          totalReviews: 0,
          reviews: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, [visible, participant]);

  if (!visible || !participant) return null;

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={20} fill="#FFD700" color="#FFD700" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={20}
          fill="#E5E7EB"
          color="#FFD700"
          strokeWidth={2}
        />,
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={20} fill="none" color="#E5E7EB" />,
      );
    }
    return stars;
  };

  const renderReviewStars = rating => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Star key={`review-${i}`} size={16} fill="#FFD700" color="#FFD700" />,
      );
    }
    const emptyStars = 5 - rating;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`review-empty-${i}`}
          size={16}
          fill="none"
          color="#E5E7EB"
        />,
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <ChevronLeft size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {reviewData?.nickname || participant?.nickname || '사용자'}님의 후기
          </Text>
        </View>
      </View>

      {/* 평균 평점 영역 */}
      {reviewData && (
        <View style={styles.ratingSection}>
          <View style={styles.ratingContent}>
            <View style={styles.ratingTop}>
              <Text style={styles.ratingNumber}>
                {reviewData.rating.toFixed(1)}
              </Text>
              <View style={styles.ratingStars}>
                {renderStars(reviewData.rating)}
              </View>
            </View>
            <Text style={styles.totalReviews}>
              총 {reviewData.totalReviews}개의 후기
            </Text>
          </View>
        </View>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#155DFC" />
          <Text style={styles.loadingText}>후기 불러오는 중...</Text>
        </View>
      )}

      {/* 후기 목록 */}
      {!loading && reviewData && (
        <ScrollView
          style={styles.reviewsList}
          contentContainerStyle={styles.reviewsContent}
          showsVerticalScrollIndicator={false}>
          {reviewData.reviews.length > 0 ? (
            reviewData.reviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAuthor}>
                    <View style={styles.authorAvatar}>
                      {review.authorProfileImageUrl ? (
                        <Image
                          source={{uri: review.authorProfileImageUrl}}
                          style={styles.authorAvatarImage}
                        />
                      ) : (
                        <Text style={styles.authorInitial}>
                          {review.authorInitial}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.authorName}>{review.author}</Text>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {renderReviewStars(review.rating)}
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>아직 받은 후기가 없습니다</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AllReviewsScreen;
