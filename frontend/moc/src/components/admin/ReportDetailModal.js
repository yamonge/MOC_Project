import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {X} from 'lucide-react-native';
import styles from '../../styles/components/admin/ReportDetailModalStyles';

/**
 * 신고 상세보기 모달
 *
 * Props:
 * - visible: 모달 표시 여부
 * - report: 신고 데이터
 * - onClose: 닫기 콜백
 * - getTypeLabel: 신고 유형 라벨 함수
 * - getStatusLabel: 상태 라벨 함수
 * - getSourceLabel: 출처 라벨 함수
 */
export default function ReportDetailModal({
  visible,
  report,
  onClose,
  getTypeLabel,
  getStatusLabel,
  getSourceLabel,
}) {
  if (!visible || !report) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalContainer}>
        {/* 헤더 */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>신고 상세 정보</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#0a0a0a" />
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <ScrollView
          style={styles.modalContent}
          contentContainerStyle={styles.modalContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>신고 ID</Text>
            <Text style={styles.detailValue}>#{report.id}</Text>
          </View>

          {report.postId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>게시글 ID</Text>
              <Text style={styles.detailValue}>{report.postId}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>출처</Text>
            <Text style={styles.detailValue}>
              {getSourceLabel(report.source)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>신고 유형</Text>
            <Text style={styles.detailValue}>{getTypeLabel(report.type)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>신고자</Text>
            <Text style={styles.detailValue}>{report.reporter}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {report.reportType === 'post' ? '레시피' : '피신고자'}
            </Text>
            <Text style={styles.detailValue}>{report.reported}</Text>
          </View>

          {report.reportType === 'user' && report.reportedUserId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>피신고자 ID</Text>
              <Text style={styles.detailValue}>{report.reportedUserId}</Text>
            </View>
          )}

          {report.reportType === 'post' && report.recipeId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>레시피 ID</Text>
              <Text style={styles.detailValue}>{report.recipeId}</Text>
            </View>
          )}

          {report.reportType === 'post' && report.recipeOwnerId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>게시글 공유자 ID</Text>
              <Text style={styles.detailValue}>{report.recipeOwnerId}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>신고 날짜</Text>
            <Text style={styles.detailValue}>{report.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>상태</Text>
            <Text style={styles.detailValue}>
              {getStatusLabel(report.status)}
            </Text>
          </View>

          <View style={styles.detailRowColumn}>
            <Text style={styles.detailLabel}>상세 설명</Text>
            <Text style={styles.detailValueMulti}>{report.details}</Text>
          </View>
        </ScrollView>

        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
