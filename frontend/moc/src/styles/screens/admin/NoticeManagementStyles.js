import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // 헤더
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    ...shadows.cardSmall,
  },

  // 헤더 상단 (뒤로가기 + 타이틀)
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 40,
    marginBottom: spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textDark,
  },

  // 검색창
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.lg,
    height: 46,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  searchIcon: {
    marginRight: spacing.sm,
  },

  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textDark,
    padding: 0,
    height: 46,
  },

  // 새 공지 작성 버튼
  createButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  createButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 9,
  },

  createButtonText: {
    ...typography.button,
    fontSize: 15,
    color: colors.white,
  },

  // 스크롤 영역
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  // 공지 카드
  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.cardSmall,
  },

  // 공지 정보
  noticeInfo: {
    marginBottom: spacing.md,
  },

  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },

  noticeTitle: {
    ...typography.subtitle,
    fontSize: 15,
    color: colors.textDark,
    flex: 1,
  },

  // 고정 뱃지
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: borderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },

  pinnedText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 11,
    color: '#008236',
    includeFontPadding: false,
  },

  // 내용 미리보기
  noticeContent: {
    ...typography.body,
    fontSize: 13,
    color: colors.textGray,
    lineHeight: 19.5,
    marginBottom: 8,
  },

  // 작성일
  noticeDate: {
    ...typography.caption,
    fontSize: 12,
    color: '#99A1AF',
  },

  // 관리 버튼 영역
  noticeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35.5,
    borderRadius: 10,
    gap: 4,
  },

  // 고정 버튼 (회색)
  pinButton: {
    backgroundColor: colors.gray100,
  },

  pinButtonText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    color: colors.textDarkGray,
    includeFontPadding: false,
  },

  // 고정 해제 버튼 (연두)
  unpinButton: {
    backgroundColor: '#DCFCE7',
  },

  unpinButtonText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    color: '#008236',
    includeFontPadding: false,
  },

  // 수정 버튼 (파란색)
  editButton: {
    backgroundColor: colors.primary,
  },

  editButtonText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    color: colors.white,
    includeFontPadding: false,
  },

  // 삭제 버튼 (빨간색)
  deleteButton: {
    backgroundColor: '#FB2C36',
  },

  deleteButtonText: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 13,
    color: colors.white,
    includeFontPadding: false,
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },

  emptyText: {
    ...typography.body,
    color: colors.textLightGray,
  },
});

export default styles;
