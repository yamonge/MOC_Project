import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getUserIdOrThrow} from '../../api/axiosConfig';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Shield, AlertTriangle, Star} from 'lucide-react-native';
import ReportCard from '../../components/mypage/ReportCard';
import {getReportHistory} from '../../api/mypage';
import styles from '../../styles/screens/mypage/ReportHistoryStyles';
import {colors} from '../../styles/common';

/* =========================
   매핑 유틸 함수들
========================= */

// statusCd → ReportCard.status
const mapStatus = statusCd => {
  switch (statusCd) {
    case 'APPROVED':
    case 'PROCESSED':
      return 'completed';
    case 'REJECTED':
      return 'rejected';
    case 'PENDING':
    default:
      return 'pending';
  }
};

// reportReasonCd → ReportCard.category
const mapCategory = reportReasonCd => {
  const cd = (reportReasonCd || '').toUpperCase();
  // 신고 모달의 코드와 매핑
  if (cd === 'PROFANITY') return 'abuse';
  if (cd === 'INAPPROPRIATE_BEHAVIOR') return 'inappropriate';
  if (cd === 'FRAUD') return 'fraud';
  if (cd === 'NO_SHOW') return 'noshow';
  if (cd === 'FAKE_PROFILE') return 'fake';
  if (cd === 'OTHER') return 'inappropriate';
  // 기존 매핑 (하위 호환성)
  if (cd.includes('COPY')) return 'copyright';
  if (cd.includes('SPAM') || cd.includes('AD')) return 'spam';
  if (cd.includes('ABUSE') || cd.includes('PROFAN')) return 'abuse';
  return 'inappropriate';
};

// ISO Date → YYYY.MM.DD
const formatDate = iso => {
  if (!iso) return '';
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

/**
 * 신고 내역 화면
 *
 * 기능:
 * - 내가 신고한 내역 목록 표시
 * - 신고 유형별 배지 표시
 * - 처리 상태별 배지 표시 (처리완료, 검토중, 반려)
 */
export default function ReportHistoryScreen({navigation}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // 화면 focus 시마다 신고 내역 새로고침
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, []),
  );

  // 신고 내역 불러오기
  const loadReports = async () => {
    try {
      setLoading(true);

      // ✅ userId 확보
      const userId = await getUserIdOrThrow();

      // ✅ axios interceptor 기준: 이미 data
      const list = await getReportHistory(userId);

      // ✅ 화면 전용 모델로 변환
      const mapped = (list ?? []).map(item => ({
        id: item.reportId,
        title: item.title,
        targetName: item.targetName,
        reason: item.reportContent || '-',
        category: mapCategory(item.reportReasonCd),
        status: mapStatus(item.statusCd),
        createdAt: formatDate(item.createdDate),
      }));

      setReports(mapped);
      setTotalCount(mapped.length);
    } catch (error) {
      console.error('신고 내역 불러오기 실패:', error);
      setReports([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 상단 헤더 */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#FFD0D0', '#FD5555', '#BC7F7F']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            angle={175.64}
            style={styles.headerGradient}
          />

          {/* 배경 장식 아이콘들 */}
          <View style={[styles.decorIcon, styles.decorIcon1]}>
            <Shield
              size={48}
              color="rgba(255, 255, 255, 0.3)"
              strokeWidth={2}
            />
          </View>
          <View style={[styles.decorIcon, styles.decorIcon2]}>
            <AlertTriangle
              size={28}
              color="rgba(255, 255, 255, 0.3)"
              strokeWidth={2}
            />
          </View>
          <View style={[styles.decorIcon, styles.decorIcon3]}>
            <Star size={42} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
          </View>

          {/* 타이틀 영역 */}
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}>
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>신고 내역</Text>
          </View>

          {/* 통계 정보 */}
          <View style={styles.headerStats}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalCount}개</Text>
            </View>
            <Shield size={16} fill="#FFF" color="#FFF" />
          </View>

          {/* 장식용 일러스트 (추후 에셋 추가 시 활성화) */}
          <Image
            source={require('../../assets/images/mypage/report.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 콘텐츠 섹션 */}
        <View style={styles.contentSection}>
          {/* 신고 리스트 */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.reportListContainer}>
              {reports.length > 0 ? (
                reports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    신고 내역이 없습니다.{'\n'}부적절한 콘텐츠를 발견하면
                    신고해주세요.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
