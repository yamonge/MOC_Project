import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius} from '../../common';

const styles = StyleSheet.create({
  // ===== 모달 오버레이 =====
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 9999,
  },

  // ===== 배경 (클릭 시 닫기) =====
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // ===== 모달 컨테이너 =====
  modalContainer: {
    width: 327,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 10000,
  },

  // ===== 헤더 =====
  modalHeader: {
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  modalTitle: {
    fontSize: 18,
    color: '#0a0a0a',
    fontFamily: 'NotoSansKR-Regular',
  },

  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 콘텐츠 =====
  modalContent: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 24,
  },

  // ===== 아이콘 =====
  iconContainer: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 회원 정보 =====
  userInfoSection: {
    alignItems: 'center',
    gap: 8,
  },

  userName: {
    fontSize: 18,
    color: '#0a0a0a',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },

  userNickname: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },

  userJoinDate: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },

  userReportCount: {
    fontSize: 14,
    color: '#fb2c36',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
  },

  // ===== 상태 배지 =====
  statusBadge: {
    height: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  statusBadgeActive: {
    backgroundColor: '#dcfce7',
  },

  statusBadgeSuspended: {
    backgroundColor: '#ffe2e2',
  },

  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
  },

  statusBadgeTextActive: {
    color: '#008236',
    includeFontPadding: false,
  },

  statusBadgeTextSuspended: {
    color: '#e7000b',
    includeFontPadding: false,
  },

  // ===== 액션 버튼 =====
  actionButtons: {
    gap: 12,
  },

  actionButton: {
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
  },

  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
  },

  cancelButton: {
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    color: '#364153',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
  },
});

export default styles;
