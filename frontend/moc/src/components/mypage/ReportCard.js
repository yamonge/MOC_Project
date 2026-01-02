import React from 'react';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from 'lucide-react-native';
import styles from '../../styles/components/mypage/ReportCardStyles';

/**
 * 신고 카드 컴포넌트
 *
 * @param {Object} report - 신고 정보
 * @param {string} report.id - 신고 ID
 * @param {string} report.title - 신고 제목
 * @param {string} report.targetName - 신고 대상 이름
 * @param {string} report.reason - 신고 사유
 * @param {string} report.category - 신고 유형 (inappropriate, copyright, abuse, spam)
 * @param {string} report.status - 처리 상태 (completed, pending, rejected)
 * @param {string} report.createdAt - 신고 날짜
 */
const ReportCard = ({report}) => {
  // 신고 유형별 배지 스타일
  const getCategoryStyle = category => {
    const styles = {
      inappropriate: {color: '#FB2C36', label: '부적절한 콘텐츠'},
      copyright: {color: '#AD46FF', label: '저작권 침해'},
      abuse: {color: '#FF6900', label: '욕설/비방'},
      spam: {color: '#F6339A', label: '스팸/광고'},
      noshow: {color: '#FFA500', label: '약속 불이행'},
      fraud: {color: '#DC143C', label: '사기'},
      fake: {color: '#9B59B6', label: '허위 프로필'},
    };
    return styles[category] || styles.inappropriate;
  };

  // 상태별 아이콘 및 텍스트
  const getStatusInfo = status => {
    const statusMap = {
      completed: {
        icon: <CheckCircle size={14} color="#1E2939" />,
        text: '처리완료',
        style: styles.statusCompleted,
      },
      pending: {
        icon: <Clock size={14} color="#1E2939" />,
        text: '검토중',
        style: styles.statusPending,
      },
      rejected: {
        icon: <XCircle size={14} color="#1E2939" />,
        text: '반려',
        style: styles.statusRejected,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const categoryStyle = getCategoryStyle(report.category);
  const statusInfo = getStatusInfo(report.status);

  return (
    <View style={styles.card}>
      {/* 그라데이션 배경 */}
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0)',
          'rgba(0, 0, 0, 0)',
          'rgba(254, 242, 242, 0.3)',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={143.13}
        style={styles.gradientOverlay}
      />

      {/* 신고 유형 배지 */}
      <View
        style={[styles.categoryBadge, {backgroundColor: categoryStyle.color}]}>
        <AlertTriangle size={12} color="#FFF" />
        <Text style={styles.categoryText}>{categoryStyle.label}</Text>
      </View>

      {/* 카드 콘텐츠 */}
      <View style={styles.content}>
        {/* 제목 & 신고 대상 */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{report.title}</Text>
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>신고 대상: </Text>
            <Text style={styles.targetName}>{report.targetName}</Text>
          </View>
        </View>

        {/* 신고 사유 */}
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>신고 사유:</Text>
          <Text style={styles.reasonText}>{report.reason}</Text>
        </View>

        {/* 날짜 & 상태 */}
        <View style={styles.footer}>
          <View style={styles.dateSection}>
            <Calendar size={14} color="#4A5565" />
            <Text style={styles.dateText}>{report.createdAt}</Text>
          </View>

          <View style={[styles.statusBadge, statusInfo.style]}>
            {statusInfo.icon}
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReportCard;
