import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeft, Pin} from 'lucide-react-native';
import {notificationAPI} from '../../api/notification';
import styles from '../../styles/screens/notification/NotificationDetailStyles';
import {colors} from '../../styles/common';

/**
 * 공지사항 상세 화면
 *
 * 화면 구조:
 * - 상단 헤더 (그라데이션 배경, 뒤로가기 버튼)
 * - 정보 영역 (핀 아이콘, 고정 뱃지, 제목, 날짜)
 * - 이미지 영역 (선택적)
 * - 본문 영역 (스크롤 가능)
 *
 * @param {Object} navigation - React Navigation 객체
 * @param {Object} route - Route 객체 (noticeId 포함)
 */
export default function NotificationDetailScreen({navigation, route}) {
  const {noticeId} = route.params || {};
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadNoticeDetail();
  }, [noticeId]);

  /**
   * 공지사항 상세 정보 불러오기
   */
  const loadNoticeDetail = async () => {
    try {
      setLoading(true);
      setError(false);

      if (!noticeId) {
        throw new Error('공지사항 ID가 없습니다.');
      }

      const data = await notificationAPI.getNotificationDetail(noticeId);
      console.log('🔍 [NotificationDetail] API 응답 데이터:', data);
      console.log('🖼️  [NotificationDetail] 이미지 URL:', data.imageUrl);
      setNotice(data);
    } catch (err) {
      console.error('공지사항 상세 불러오기 실패:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 뒤로가기
   */
  const handleGoBack = () => {
    navigation.navigate('Notification');
  };

  /**
   * 재시도
   */
  const handleRetry = () => {
    loadNoticeDetail();
  };

  /**
   * 로딩 상태 렌더링
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <LinearGradient
          colors={['#00B8DB', '#155DFC']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>공지사항</Text>
        </LinearGradient>

        {/* 로딩 */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * 에러 상태 렌더링
   */
  if (error || !notice) {
    return (
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <LinearGradient
          colors={['#00B8DB', '#155DFC']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>공지사항</Text>
        </LinearGradient>

        {/* 에러 */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            공지사항을 불러오는데 실패했습니다.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <LinearGradient
        colors={['#00B8DB', '#155DFC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
      </LinearGradient>

      {/* 본문 스크롤 영역 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 정보 영역 */}
        <View style={styles.infoSection}>
          {/* 고정 공지 뱃지 (고정 공지인 경우에만 표시) */}
          {notice.isPinned && (
            <View style={styles.badgeContainer}>
              <Pin
                size={16}
                color={colors.primaryBlue}
                fill={colors.primaryBlue}
                style={styles.pinIcon}
              />
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedBadgeText}>고정 공지</Text>
              </View>
            </View>
          )}

          {/* 제목 */}
          <Text style={styles.noticeTitle}>{notice.title}</Text>

          {/* 날짜 */}
          <Text style={styles.noticeDate}>{notice.createdAt}</Text>
        </View>

        {/* 이미지 영역 (있는 경우에만 표시) */}
        {notice.imageUrl && (
          <View style={styles.imageSection}>
            <Image
              source={{uri: notice.imageUrl}}
              style={styles.noticeImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* 본문 영역 */}
        <View style={styles.contentSection}>
          <Text style={styles.noticeContent}>{notice.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
