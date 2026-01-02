import {StyleSheet} from 'react-native';
import {colors} from '../../common';

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
    zIndex: 10000,
  },

  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 20,
    zIndex: 10001,
    overflow: 'hidden',
  },

  // ===== 헤더 =====
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 콘텐츠 =====
  modalContent: {
    maxHeight: 400,
  },

  modalContentContainer: {
    padding: 20,
    paddingBottom: 20,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  detailRowColumn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  detailLabel: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '400',
  },

  detailValueMulti: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 20,
    marginTop: 4,
  },

  // ===== 버튼 =====
  modalButton: {
    margin: 20,
    height: 48,
    backgroundColor: '#155dfc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'NotoSansKR-Medium',
  },
});

export default styles;
