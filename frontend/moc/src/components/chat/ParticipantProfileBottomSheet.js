import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {X, AlertTriangle, Star, Award, Users} from 'lucide-react-native';
import styles from '../../styles/components/chat/ParticipantProfileBottomSheetStyles';
import AllReviewsScreen from './AllReviewsScreen';
import ReportModal from '../common/ReportModal';
import {reportUser} from '../../api/report';
import {getPublicProfile, getUserReviews} from '../../api/chat';

const ParticipantProfileBottomSheet = ({
  visible,
  onClose,
  participant,
  onReport,
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  // 바텀시트 열기/닫기
  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  }, [onClose]);

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleSubmitReport = async reportData => {
    // ✅ ReportModal에서 이미 API 호출을 처리하므로 여기서는 삭제
    // ReportModal의 onSubmit은 추가 작업이 필요한 경우에만 사용
    console.log('✅ [ParticipantProfileBottomSheet] 신고 완료 콜백');
  };

  const handleViewAllReviews = () => {
    setShowAllReviews(true);
  };

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!visible || !participant?.userId) return;

      setLoading(true);
      try {
        console.log('👤 [프로필] 데이터 로드 시작:', participant.userId);

        // 프로필 및 후기 동시 조회
        const [profile, reviews] = await Promise.all([
          getPublicProfile(participant.userId),
          getUserReviews(participant.userId, 5), // 최근 5개
        ]);

        // ✅ API 응답 전체 확인 (디버깅용)
        console.log('📦 [프로필] API 응답:', JSON.stringify(profile, null, 2));
        console.log('📝 [후기] API 응답:', JSON.stringify(reviews, null, 2));

        // 날짜 포맷팅
        const formatJoinDate = dateString => {
          if (!dateString) return '가입일 알 수 없음';
          const date = new Date(dateString);
          return `${date.getFullYear()}년 ${date.getMonth() + 1}월 가입`;
        };

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

        setProfileData({
          nickname: profile.userNickname || participant.nickname || '사용자',
          profileImageUrl: profile.profileImageUrl || participant.profileImageUrl || null,
          joinDate: formatJoinDate(profile.createdDate),
          rating: profile.ratingScore || 0,
          reviewCount: profile.reviewCnt || 0,
          completedMeetings: profile.shoppingCompletedCnt || 0,
          attendanceRate: profile.attendanceRate || 0, // ✅ 실제 백엔드 데이터 사용
          recentReviews: Array.isArray(reviews)
            ? reviews.map((review, index) => ({
                id: review.userReviewId || index,
                author: review.writerNickname || '익명',
                rating: review.rating || 5,
                date: getRelativeTime(review.createdDate),
                content: review.comment || review.userReviewComment || '', // ✅ comment 필드 우선 사용
              }))
            : [],
        });

        console.log('✅ [프로필] 데이터 로드 완료');
      } catch (error) {
        console.error('❌ [프로필] 데이터 로드 실패:', error);
        // 에러 시 기본값 설정
        setProfileData({
          nickname: participant.nickname || '사용자',
          profileImageUrl: participant.profileImageUrl || null,
          joinDate: '가입일 알 수 없음',
          rating: 0,
          reviewCount: 0,
          completedMeetings: 0,
          attendanceRate: 0,
          recentReviews: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [visible, participant]);

  if (!visible || !participant) return null;

  const renderStars = (rating, size = 16) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={size} fill="#FFD700" color="#FFD700" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={size}
          fill="#E5E7EB"
          color="#FFD700"
          strokeWidth={2}
        />,
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={size} fill="none" color="#E5E7EB" />,
      );
    }
    return stars;
  };

  const renderReviewStars = rating => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Star key={`review-${i}`} size={12} fill="#FFD700" color="#FFD700" />,
      );
    }
    const emptyStars = 5 - rating;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`review-empty-${i}`}
          size={12}
          fill="none"
          color="#E5E7EB"
        />,
      );
    }
    return stars;
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={visible ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleClose}
        backdropComponent={({style}) => (
          <TouchableOpacity
            style={[style, styles.backdrop]}
            activeOpacity={1}
            onPress={handleClose}
          />
        )}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>프로필</Text>
            <View style={styles.headerActions}>
              {/* 본인이 아닐 때만 신고 버튼 표시 */}
              {!participant?.isMe && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleReport}
                  activeOpacity={0.7}>
                  <AlertTriangle size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleClose}
                activeOpacity={0.7}>
                <X size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 콘텐츠 */}
          <BottomSheetScrollView
            style={styles.content}
            contentContainerStyle={{
              paddingBottom: 100, // 또는 더 큰 값 (60-100)
            }}
            showsVerticalScrollIndicator={false}>
            {/* 로딩 상태 */}
            {loading && (
              <View style={{padding: 40, alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#155DFC" />
                <Text style={{marginTop: 16, color: '#737373'}}>
                  프로필 로딩 중...
                </Text>
              </View>
            )}

            {/* 프로필 데이터 */}
            {!loading && profileData && (
              <>
                {/* 프로필 정보 */}
                <View style={styles.profileSection}>
                  <View style={styles.avatarContainer}>
                    {profileData.profileImageUrl ? (
                      <Image
                        source={{uri: profileData.profileImageUrl}}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {profileData.nickname.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.nickname}>{profileData.nickname}</Text>
                  <Text style={styles.joinDate}>{profileData.joinDate}</Text>
                </View>

                {/* 통계 */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Award size={28} color="#155DFC" strokeWidth={2} />
                    <Text style={styles.statValue}>
                      {profileData.completedMeetings}
                    </Text>
                    <Text style={styles.statLabel}>완료한 모임</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Star
                      size={28}
                      fill="#FFD700"
                      color="#FFD700"
                      strokeWidth={2}
                    />
                    <Text style={styles.statValue}>
                      {profileData.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>
                      리뷰 ({profileData.reviewCount}개)
                    </Text>
                  </View>
                </View>

                {/* 최근 받은 후기 */}
                <View style={styles.reviewsSection}>
                  <View style={styles.reviewsHeader}>
                    <Text style={styles.reviewsTitle}>최근 받은 후기</Text>
                    <TouchableOpacity
                      onPress={handleViewAllReviews}
                      activeOpacity={0.7}>
                      <Text style={styles.viewAllButton}>전체보기</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.reviewsList}>
                    {profileData.recentReviews.map(review => (
                      <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                          <View style={styles.reviewAuthor}>
                            <Text style={styles.reviewAuthorName}>
                              {review.author}
                            </Text>
                            <View style={styles.reviewStarsContainer}>
                              {renderReviewStars(review.rating)}
                            </View>
                          </View>
                          <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <Text style={styles.reviewContent}>
                          {review.content}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>

      {/* 전체 후기 화면 */}
      {showAllReviews && (
        <Portal>
          <AllReviewsScreen
            visible={showAllReviews}
            onClose={() => setShowAllReviews(false)}
            participant={participant}
          />
        </Portal>
      )}

      {/* 신고 모달 */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportTarget={{
          ...participant,
          type: 'user', // 🔥 신고 타입 추가
          id: participant?.userId, // 🔥 신고 대상 ID
        }}
        onSubmit={handleSubmitReport}
      />
    </>
  );
};

export default ParticipantProfileBottomSheet;
