import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeft, ChevronRight, Pin} from 'lucide-react-native';
import {notificationAPI} from '../../api/notification';
import styles from '../../styles/screens/notification/NotificationListStyles';
import {colors} from '../../styles/common';

/**
 * 공지사항 목록 화면
 *
 * 화면 구조:
 * - 상단 헤더 (그라데이션 배경, 뒤로가기 버튼)
 * - 고정 공지 (파란색 배경, 핀 아이콘)
 * - 일반 공지 (흰색 배경)
 *
 * @param {Object} navigation - React Navigation 객체
 */
export default function NotificationListScreen({navigation}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, []),
  );

  /**
   * 공지사항 목록 불러오기
   */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationAPI.getNotifications();

      // 고정 공지를 상단에 배치
      const sorted = [...data].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      setNotifications(sorted);
    } catch (error) {
      console.error('공지사항 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 공지사항 카드 클릭 핸들러
   */
  const handleNoticePress = notice => {
    console.log('공지사항 클릭:', notice.id, notice.title);
    navigation.navigate('NotificationDetail', {noticeId: notice.id});
  };

  /**
   * 고정 공지 카드 렌더링
   */
  const renderPinnedCard = ({item}) => (
    <TouchableOpacity
      style={styles.pinnedCard}
      onPress={() => handleNoticePress(item)}
      activeOpacity={0.8}>
      <View style={styles.pinnedCardContent}>
        {/* 핀 아이콘 + 고정 뱃지 */}
        <View style={styles.pinnedHeader}>
          <Pin size={16} color="white" fill="white" />
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedBadgeText}>고정</Text>
          </View>
        </View>

        {/* 제목 */}
        <Text style={styles.pinnedTitle} numberOfLines={1}>
          {item.title}
        </Text>

        {/* 날짜 */}
        <Text style={styles.pinnedDate}>{item.createdAt}</Text>
      </View>

      {/* 화살표 아이콘 */}
      <View style={styles.pinnedArrow}>
        <ChevronRight size={20} color="white" />
      </View>
    </TouchableOpacity>
  );

  /**
   * 일반 공지 카드 렌더링
   */
  const renderNormalCard = ({item}) => (
    <TouchableOpacity
      style={styles.normalCard}
      onPress={() => handleNoticePress(item)}
      activeOpacity={0.8}>
      <View style={styles.normalCardContent}>
        {/* 제목 */}
        <Text style={styles.normalTitle} numberOfLines={1}>
          {item.title}
        </Text>

        {/* 날짜 */}
        <Text style={styles.normalDate}>{item.createdAt}</Text>
      </View>

      {/* 화살표 아이콘 */}
      <View style={styles.normalArrow}>
        <ChevronRight size={20} color="#A4A4A6" />
      </View>
    </TouchableOpacity>
  );

  /**
   * 공지사항 카드 렌더링 (고정/일반 구분)
   */
  const renderNoticeCard = ({item}) => {
    if (item.isPinned) {
      return renderPinnedCard({item});
    }
    return renderNormalCard({item});
  };

  /**
   * 빈 상태 렌더링
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>공지사항이 없습니다</Text>
    </View>
  );

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
            onPress={() => navigation.goBack()}
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
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
      </LinearGradient>

      {/* 공지사항 목록 */}
      <FlatList
        data={notifications}
        renderItem={renderNoticeCard}
        keyExtractor={item => `notice-${item.id}`}
        style={styles.noticeList}
        contentContainerStyle={styles.noticeListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}
