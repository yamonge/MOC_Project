import {StyleSheet} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../../common';

export const resetPasswordStyles = StyleSheet.create({
  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bgWhite,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.subtitle,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },

  // 스크롤 컨테이너
  scrollContainer: {
    flexGrow: 1,
  },

  // 컨텐츠
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  // 일러스트
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // 제목 영역
  titleContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textDark,
    marginBottom: spacing.xs,
    includeFontPadding: false,
  },
  description: {
    ...typography.body2,
    color: colors.textLight,
    lineHeight: 22,
    includeFontPadding: false,
  },

  // 입력 섹션
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body2,
    color: colors.textDark,
    marginBottom: spacing.xs,
    fontWeight: '600',
    includeFontPadding: false,
  },

  // 제출 버튼
  submitButtonContainer: {
    marginBottom: spacing.lg,
  },

  // 안내 박스
  infoBox: {
    backgroundColor: '#FAF5FF', // 연보라
    borderWidth: 1,
    borderColor: '#E9D4FF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoBoxTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: '#59168B',
    marginBottom: spacing.xs,
  },
  infoBoxContent: {
    gap: spacing.xs,
  },
  infoBoxItem: {
    ...typography.caption,
    fontSize: 12,
    color: '#8200DB',
    lineHeight: 18,
    marginBottom: 2,
  },

  // 로딩 오버레이
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
