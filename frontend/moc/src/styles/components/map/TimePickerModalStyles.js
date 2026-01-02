import {StyleSheet} from 'react-native';
import {colors, spacing} from '../../common';

export default StyleSheet.create({
  // 오버레이
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },

  // 배경 터치 영역
  background: {
    flex: 1,
  },

  // 모달 컨테이너
  modalContainer: {
    backgroundColor: colors.backgroundWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '90%',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 스크롤 컨텐츠
  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 24,
  },

  // 섹션
  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Medium',
  },

  // 날짜 그리드
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  dateButton: {
    width: '31%',
    height: 44,
    backgroundColor: colors.backgroundWhite,
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateButtonSelected: {
    backgroundColor: 'rgba(127, 201, 231, 0.1)',
    borderColor: '#7FC9E7',
  },

  dateButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Medium',
  },

  dateButtonTextSelected: {
    color: '#0092B8',
  },

  // 오전/오후 선택
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },

  periodButton: {
    flex: 1,
    height: 44,
    backgroundColor: colors.backgroundWhite,
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodButtonSelected: {
    backgroundColor: 'rgba(127, 201, 231, 0.1)',
    borderColor: '#7FC9E7',
  },

  periodButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Bold',
  },

  periodButtonTextSelected: {
    color: '#0092B8',
  },

  // 시간 그리드 (시/분)
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  timeButton: {
    width: '14.5%',
    height: 40,
    backgroundColor: colors.backgroundWhite,
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeButtonSelected: {
    backgroundColor: 'rgba(127, 201, 231, 0.1)',
    borderColor: '#7FC9E7',
  },

  timeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Medium',
  },

  timeButtonTextSelected: {
    color: '#0092B8',
  },

  // 선택된 시간 표시
  selectedTimeContainer: {
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },

  selectedTimeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Medium',
  },

  selectedTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
  },

  // 푸터
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 13,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.backgroundWhite,
    borderWidth: 2,
    borderColor: '#D1D5DC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Bold',
  },

  confirmButtonWrapper: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },

  confirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'NotoSansKR-Bold',
  },
});
