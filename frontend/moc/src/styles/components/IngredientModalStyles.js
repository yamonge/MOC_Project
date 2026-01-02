import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  // 모달 오버레이
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 38,
    zIndex: 9999,
  },

  // 배경 (클릭 시 닫기)
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // 모달 래퍼
  modalWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },

  // 모달 컨테이너
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    width: '100%',
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
    gap: 16,
  },

  // 타이틀
  modalTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0A0A0A',
    textAlign: 'center',
    fontFamily: 'NotoSansKR-Regular',
  },

  // 텍스트 인풋 (추가/수정)
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'NotoSansKR-Regular',
    textAlignVertical: 'center',
  },

  // 확인 메시지 (삭제)
  modalMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4A5565',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'NotoSansKR-Regular',
    marginTop: -15,
    marginBottom: 10,
  },

  // 버튼 영역
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  // 취소 버튼
  modalCancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#364153',
    fontFamily: 'NotoSansKR-Regular',
  },

  // 확인 버튼 (그라데이션 - 추가/수정)
  modalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalConfirmInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
  },

  // 삭제 버튼 (빨간색)
  modalDeleteButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
  },
});
