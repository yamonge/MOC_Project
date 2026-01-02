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
 * 계정 찾기 화면 전용 스타일
 */
export const findAccountStyles = StyleSheet.create({
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
    backgroundColor: colors.bgWhite,
    ...shadows.cardSmall,
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    ...typography.subtitle,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },

  // 탭 영역
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
  },

  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    ...typography.button,
    color: colors.textLight,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },

  // 컨텐츠 영역
  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // 일러스트
  illustrationContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // 타이틀 & 설명
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    ...typography.subtitle,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },

  description: {
    ...typography.caption,
    color: '#4A5565',
    textAlign: 'center',
  },

  // Input 영역
  inputSection: {
    marginTop: 16,
    marginBottom: 16,
  },

  inputGroup: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#364153',
    marginBottom: 6,
  },

  // 버튼
  submitButtonContainer: {
    marginBottom: 16,
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
    marginTop: spacing.xs,
  },

  infoBoxItem: {
    ...typography.caption,
    fontSize: 12,
    color: '#8200DB',
    lineHeight: 18,
    marginBottom: 2,
  },

  // 결과 박스 (아이디 찾기 성공 시)
  resultBox: {
    backgroundColor: colors.bgGray,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },

  resultTitle: {
    ...typography.button,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },

  resultId: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.md,
  },

  resultDate: {
    ...typography.caption,
    color: colors.textLight,
  },

  resultButtonContainer: {
    marginTop: spacing.md,
    width: '100%',
  },

  // 로딩 오버레이
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default findAccountStyles;
