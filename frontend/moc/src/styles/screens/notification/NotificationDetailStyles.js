import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

export default StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 헤더
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    ...shadows.cardMedium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    color: colors.textWhite,
    marginLeft: spacing.sm,
    includeFontPadding: false,
  },

  // 스크롤 컨테이너
  scrollContent: {
    paddingBottom: 120, // 하단 네비게이션 공간 확보
  },

  // 정보 영역 (상단)
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#EFF6FF', // 그라데이션 배경 대체
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pinIcon: {
    marginRight: spacing.sm,
  },
  pinnedBadge: {
    backgroundColor: colors.primary, // #155DFC
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  pinnedBadgeText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16.5,
    color: colors.textWhite,
    includeFontPadding: false,
  },
  noticeTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    color: colors.textDark, // #36454F
    marginBottom: spacing.sm,
    includeFontPadding: false,
  },
  noticeDate: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: '#A4A4A6',
    includeFontPadding: false,
  },

  // 이미지 영역
  imageSection: {
    width: '100%',
    height: 220,
    backgroundColor: '#F3F4F6',
  },
  noticeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 본문 영역
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 342,
  },
  noticeContent: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24.375,
    color: colors.textDark, // #36454F
    includeFontPadding: false,
  },

  // 로딩
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 에러
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  errorText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.md,
    includeFontPadding: false,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    color: colors.textWhite,
    includeFontPadding: false,
  },
});
