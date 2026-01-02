import {StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../../common/index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 하단 네비게이션 바 공간
  },

  // 프로필 영역
  profileSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  profileImageContainer: {
    width: 86,
    height: 86,
    borderRadius: 50,
    backgroundColor: colors.white,
    shadowColor: '#f1f7ff',
    shadowOffset: {width: -3, height: 7},
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 5,
    marginBottom: 11,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    ...typography.title,
    fontSize: 36,
    color: colors.white,
    fontWeight: '700',
  },
  nickname: {
    ...typography.title,
    fontSize: 20,
    color: '#10275a',
    marginBottom: 4,
    fontWeight: '700',
  },
  email: {
    ...typography.body,
    fontSize: 14,
    color: '#10275a',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#5f5f60',
    paddingHorizontal: 20,
    borderRadius: 30,
    height: 40,
    minWidth: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },

  // 메뉴 그리드
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  menuCardWrapper: {
    width: '47%', // 2개씩 배치 (약간의 간격 고려)
    marginBottom: 15,
  },
});
