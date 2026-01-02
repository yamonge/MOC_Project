import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Clock,
  Users,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react-native';
import {formatDistanceToNow} from 'date-fns';
import {ko} from 'date-fns/locale';
import styles from '../../styles/components/map/PostCardStyles';
import {colors} from '../../styles/common';

/**
 * 게시물 카드 컴포넌트
 * - 축소 상태: 기본 정보 + "상세보기" 버튼
 * - 확장 상태: 기본 정보 + "접기" 버튼 + 상세 내용 + "참여하기"/"채팅방 입장" 버튼
 */
export default function PostCard({
  post,
  onJoin,
  isOwner = false,
  isParticipant = false,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleJoin = () => {
    if (onJoin) {
      onJoin(post);
    }
  };

  /**
   * =========================
   * ✅ [핵심 수정] createdAt이 어떤 값이 와도 앱이 절대 안 죽게 처리
   * - formatDistanceToNow는 Invalid Date를 받으면 RangeError로 앱이 죽을 수 있음
   * - 따라서 "유효한 날짜인지"를 JS 표준 방식으로만 검사
   * =========================
   */
  const timeAgo = useMemo(() => {
    try {
      const raw = post?.createdAt;
      if (!raw) return '-';

      const d = new Date(raw);

      // ✅ Invalid Date 판별(가장 안전)
      if (Number.isNaN(d.getTime())) return '-';

      return formatDistanceToNow(d, {addSuffix: true, locale: ko});
    } catch (e) {
      return '-';
    }
  }, [post?.createdAt]);

  const formatMeetDateTime = (meetDatetime, fallbackMeetTime) => {
    if (!meetDatetime) return fallbackMeetTime ?? '-';

    const d = new Date(meetDatetime);
    if (Number.isNaN(d.getTime())) return fallbackMeetTime ?? '-';

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    // ✅ 요일 고정(ko)
    const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = WEEKDAY_KO[d.getDay()];

    // ✅ 시간 24h 고정 HH:mm
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${mm}/${dd}(${weekday}) ${hh}:${min}`;
  };

  /**
   * =========================
   * ✅ [추가] post 자체가 undefined/null이면 카드 렌더 중 크래시 가능
   * - 안전하게 placeholder 렌더
   * =========================
   */
  if (!post) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.storeName}>-</Text>
          <Text style={styles.timeAgo}>-</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* 카드 내용 */}
      <View style={styles.cardContent}>
        {/* 상단 헤더 (마트명 + 거리) */}
        <View style={styles.cardHeader}>
          <View style={styles.leftSection}>
            <Text style={styles.storeName}>{post.storeName}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <MapPin size={14} color={colors.textGray} />
            <Text style={styles.distanceText}>{post.distance}</Text>
          </View>
        </View>

        {/* 정보 그리드 */}
        <View style={styles.infoGrid}>
          {/* 1행: 시간 + 인원수 */}
          <View style={{flexDirection: 'row', gap: 12}}>
            {/* 시간 */}
            <View style={{flex: 1, flexDirection: 'row', gap: 8}}>
              <View style={styles.iconBox}>
                <Clock size={16} color={colors.textGray} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>시간</Text>
                <Text style={styles.infoValue}>
                  {formatMeetDateTime(post.meetDatetime, post.meetTime)}
                </Text>
              </View>
            </View>

            {/* 인원수 */}
            <View style={{flex: 1, flexDirection: 'row', gap: 8}}>
              <View style={styles.iconBox}>
                <Users size={16} color={colors.textGray} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>인원수</Text>
                <Text style={styles.infoValue}>
                  {post.currentCount}/{post.maxCount}명
                </Text>
              </View>
            </View>
          </View>

          {/* 2행: 구매 항목 */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <ShoppingCart size={16} color={colors.textGray} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>구매 항목</Text>
              <Text style={styles.infoValue}>{post.items}</Text>
            </View>
          </View>

          {/* 3행: 작성자 */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <User size={16} color={colors.textGray} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>작성자</Text>
              <Text style={styles.infoValue}>{post.author}</Text>
            </View>
          </View>
        </View>

        {/* 상세보기/접기 버튼 */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleExpand}
          activeOpacity={0.8}>
          <Text style={styles.toggleButtonText}>
            {expanded ? '접기' : '상세보기'}
          </Text>
          {expanded ? (
            <ChevronUp size={16} color={'#ffffff'} />
          ) : (
            <ChevronDown size={16} color={'#ffffff'} />
          )}
        </TouchableOpacity>
      </View>

      {/* 확장된 콘텐츠 */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* 상세 내용 */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>상세 내용</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{post.description}</Text>
            </View>
          </View>

          {/* 참여하기/채팅방 입장 버튼 */}
          <TouchableOpacity
            style={
              isOwner || isParticipant ? styles.ownerButton : styles.joinButton
            }
            onPress={handleJoin}
            activeOpacity={0.8}>
            <Users size={18} color={colors.white} />
            <Text style={styles.joinButtonText}>
              {isOwner || isParticipant ? '채팅방 입장' : '참여하기'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
