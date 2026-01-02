import {StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../../common/index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 헤더
  header: {
    height: 134,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    overflow: 'hidden',
  },

  // 배경 장식 아이콘
  decorIcon: {
    position: 'absolute',
  },

  decorIcon1: {
    top: 46,
    left: 291,
    transform: [{rotate: '12deg'}],
  },

  decorIcon2: {
    top: 76,
    left: 269,
    transform: [{rotate: '-6deg'}],
  },

  decorIcon3: {
    top: 94,
    left: -6,
    transform: [{rotate: '45deg'}],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    ...typography.title,
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    ...typography.title,
    fontSize: 28,
    color: colors.white,
    fontWeight: '700',
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRight: {
    width: 40, // 백 버튼과 동일한 너비 (좌우 대칭)
  },
  illustrationImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 136,
    height: 136,
  },

  // 스크롤 영역
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100, // 하단 네비게이션 바 공간
  },

  // 섹션 제목
  sectionTitleContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 13,
    color: '#6a7282',
    fontWeight: '500',
  },

  // 메뉴 항목
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemAdmin: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ffc9c9',
    backgroundImage: 'linear-gradient(90deg, #fef2f2 0%, #fdf2f8 100%)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2b7fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerAdmin: {
    backgroundColor: '#fb2c36',
  },
  menuLabel: {
    ...typography.body,
    fontSize: 15,
    color: '#36454f',
    fontWeight: '500',
    flex: 1,
  },

  // 회원탈퇴 버튼
  withdrawButton: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#3d3d3d',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  withdrawButtonText: {
    ...typography.button,
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  // 버전 정보
  versionContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  versionText: {
    ...typography.caption,
    fontSize: 13,
    color: '#99a1af',
    fontWeight: '400',
    marginBottom: spacing.sm,
  },
  copyrightText: {
    ...typography.caption,
    fontSize: 12,
    color: '#99a1af',
    fontWeight: '400',
  },
});
