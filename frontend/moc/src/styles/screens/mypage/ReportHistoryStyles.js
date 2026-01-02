import {StyleSheet, Dimensions} from 'react-native';
import {colors, typography, spacing} from '../../common';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default StyleSheet.create({
  // ===== Container =====
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100, // 하단 네비게이션 영역 확보
    gap: 30,
  },

  // ===== Header Section =====
  headerSection: {
    height: 134,
    width: '100%',
    backgroundColor: '#FD5555',
    paddingHorizontal: 20,
    paddingTop: 30,
    position: 'relative',
    overflow: 'hidden',
  },

  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  // 상단 타이틀 영역
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 36,
  },

  // 하단 통계 정보
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 50,
  },

  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    height: 23.5,
    justifyContent: 'center',
  },

  countText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 19.5,
  },

  // 장식용 일러스트 이미지
  illustrationImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 136,
    height: 136,
  },

  // ===== Content Section =====
  contentSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  // ===== Report List =====
  reportListContainer: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },

  // ===== Empty State =====
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },

  emptyText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 24,
  },

  // ===== Loading =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
});
