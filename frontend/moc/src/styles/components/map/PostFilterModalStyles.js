import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../common';

export default StyleSheet.create({
  // 오버레이 (반투명 배경)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  // 모달 컨테이너
  modalContainer: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    height: '85%',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },

  headerTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textBlack,
    fontFamily: typography.subtitle.fontFamily,
  },

  closeButton: {
    padding: spacing.xs,
  },

  // 스크롤 영역
  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  // 섹션
  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textBlack,
    marginBottom: spacing.sm,
    fontFamily: typography.button.fontFamily,
  },

  // 재료 그리드
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  ingredientButton: {
    width: '48%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ingredientButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% 투명도
  },

  ingredientText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textLight,
    fontFamily: typography.body.fontFamily,
  },

  ingredientTextSelected: {
    color: colors.primary,
    fontFamily: typography.button.fontFamily,
  },

  // 슬라이더
  slider: {
    width: '100%',
    height: 40,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },

  sliderLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },

  // 시간 선택 버튼
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
  },

  timeButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    fontFamily: typography.body.fontFamily,
  },

  timeButtonTextSelected: {
    color: colors.textBlack,
  },

  // 하단 버튼 영역
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 1,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },

  // 초기화 버튼
  resetButton: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textLight,
    fontFamily: typography.button.fontFamily,
  },

  // 적용하기 버튼
  applyButton: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  applyButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textWhite,
    fontFamily: typography.button.fontFamily,
  },
});
