import {StyleSheet} from 'react-native';
import {colors} from '../../common';

export default StyleSheet.create({
  // ===== Card Container =====
  card: {
    width: 320,
    height: 240,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },

  // 그라데이션 배경
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ===== 신고 유형 배지 =====
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 23,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },

  categoryIcon: {
    width: 12,
    height: 12,
  },

  categoryText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 15,
  },

  // ===== 카드 콘텐츠 =====
  content: {
    paddingTop: 52,
    paddingHorizontal: 16,
    gap: 12,
  },

  // 제목 & 신고 대상
  headerSection: {
    gap: 4,
  },

  title: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0A',
    lineHeight: 27,
  },

  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  targetLabel: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 13,
    color: '#4A5565',
    lineHeight: 19.5,
  },

  targetName: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#1E2939',
    lineHeight: 19.5,
  },

  // 신고 사유 박스
  reasonBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingTop: 13,
    paddingBottom: 10,
    paddingHorizontal: 13,
    gap: 4,
  },

  reasonLabel: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    color: '#4A5565',
    lineHeight: 18,
  },

  reasonText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: '#1E2939',
    lineHeight: 19.5,
  },

  // 하단 정보 (날짜 + 상태)
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
  },

  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  dateText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5565',
    lineHeight: 18,
  },

  // 상태 배지
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 11,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
  },

  statusText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#1E2939',
    lineHeight: 18,
  },

  // 상태별 스타일
  statusCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#B9F8CF',
  },

  statusPending: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FFF085',
  },

  statusRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FFC9C9',
  },
});
