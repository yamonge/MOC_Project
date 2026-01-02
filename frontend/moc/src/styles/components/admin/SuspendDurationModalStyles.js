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
    paddingHorizontal: 24,
    zIndex: 10000,
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
    zIndex: 10001,
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

  // ===== 버튼 컨테이너 =====
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 12,
  },

  // ===== 기간 선택 버튼 =====
  durationButton: {
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
  },

  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
  },
});

export default styles;
