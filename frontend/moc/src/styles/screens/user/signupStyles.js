import {StyleSheet} from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
} from '../../common';

/**
 * 회원가입 화면 전용 스타일
 */
export const signupStyles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    ...typography.subtitle,
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: spacing.sm,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // 상단 일러스트
  illustrationContainer: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },

  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // 타이틀
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },

  // Input 컨테이너
  inputSection: {
    marginBottom: 16,
  },

  inputWithButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  inputWithButton: {
    flex: 1,
    marginRight: spacing.sm,
  },

  checkButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    borderRadius: borderRadius.sm,
    height: layout.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    marginBottom: 16,
  },

  checkButtonText: {
    fontSize: 15,
    color: colors.textWhite,
    fontWeight: '700',
  },

  checkButtonSuccess: {
    backgroundColor: colors.success,
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputContainerInputName: {
    marginTop: -30,
  },

  inputContainerInputPassword: {
    marginTop: 0,
  },

  birthDateInputContainer: {
    marginBottom: 16,
    marginTop: -20,
    justifyContent: 'center',
  },

  // 생년월일 선택 Input
  birthDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    paddingVertical: -20,
    paddingLeft: 10,
    gap: 10,
  },

  birthDateIcon: {
    width: layout.iconSizeMedium,
    height: layout.iconSizeMedium,
    marginRight: spacing.sm,
  },

  birthDateText: {
    ...typography.body,
    color: colors.textDark,
  },

  birthDatePlaceholder: {
    ...typography.body,
    color: colors.textLight,
  },

  // 약관 동의 영역
  termsSection: {
    paddingTop: spacing.md,
    marginTop: -spacing.xl,
  },

  termsSectionTitle: {
    ...typography.button,
    color: colors.textDark,
    marginBottom: spacing.md,
  },

  // 전체 동의 체크박스
  allAgreeContainer: {
    backgroundColor: '#EFF6FF', // 그라데이션 대체
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },

  // 약관 항목 컨테이너
  termItemContainer: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },

  termItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.md,
    minHeight: 53,
    justifyContent: 'space-between',
  },

  termItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  termItemText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.textDark,
    marginLeft: spacing.md,
  },

  termItemBadge: {
    ...typography.caption,
    fontSize: 14,
    marginLeft: spacing.xs,
  },

  requiredBadge: {
    color: colors.error,
  },

  optionalBadge: {
    color: '#99A1AF',
  },

  expandButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  // 약관 내용 (확장 영역)
  termContentContainer: {
    backgroundColor: colors.bgGray,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  termContentText: {
    ...typography.caption,
    fontSize: 13,
    color: '#4A5565',
    lineHeight: 21,
    backgroundColor: colors.bgWhite,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },

  termContentScrollView: {
    maxHeight: 150,
  },

  termContentScrollViewInner: {
    flexGrow: 1,
  },

  // 회원가입 버튼
  signupButtonContainer: {
    marginTop: 24,
    marginBottom: 24,
  },

  // 로딩 오버레이
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  // 에러 메시지
  errorContainer: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },

  errorText: {
    ...typography.body,
    color: colors.textWhite,
    textAlign: 'center',
  },
});

export default signupStyles;
