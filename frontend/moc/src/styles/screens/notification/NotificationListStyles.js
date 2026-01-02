import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

export default StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF', // 그라데이션 배경 대체 (연한 파란색)
  },

  // 헤더
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    backgroundColor: colors.primary, // #155DFC
    // 그라데이션은 LinearGradient 컴포넌트로 구현
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
    lineHeight: 30,
    color: colors.textWhite,
    marginLeft: spacing.sm,
    includeFontPadding: false,
  },

  // 공지사항 목록
  noticeList: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  noticeListContent: {
    paddingBottom: 120, // 하단 네비게이션 공간 확보
  },

  // 고정 공지 카드
  pinnedCard: {
    height: 108,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: 12,
    backgroundColor: colors.primary, // #155DFC
    ...shadows.cardMedium,
  },
  pinnedCardContent: {
    flex: 1,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 10,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: spacing.sm,
  },
  pinnedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  pinnedTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.textWhite,
    marginBottom: 4,
    includeFontPadding: false,
  },
  pinnedDate: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5,
    color: 'rgba(255, 255, 255, 0.8)',
    includeFontPadding: false,
  },
  pinnedArrow: {
    position: 'absolute',
    right: 16,
    top: 20,
  },

  // 일반 공지 카드
  normalCard: {
    height: 78,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: 12,
    backgroundColor: colors.bgWhite,
    ...shadows.cardSmall,
  },
  normalCardContent: {
    flex: 1,
  },
  normalTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22.5,
    color: colors.textDark, // #36454F
    marginBottom: 4,
    includeFontPadding: false,
  },
  normalDate: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5,
    color: '#A4A4A6',
    includeFontPadding: false,
  },
  normalArrow: {
    position: 'absolute',
    right: 16,
    top: 20,
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    color: colors.textGray,
    includeFontPadding: false,
  },

  // 로딩
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
