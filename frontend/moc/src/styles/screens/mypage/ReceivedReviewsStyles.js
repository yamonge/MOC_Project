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
  },

  // ===== Header Section =====
  headerSection: {
    height: 134,
    width: '100%',
    backgroundColor: '#FFD230',
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 42,
  },

  // 하단 통계 정보
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 50,
  },

  reviewCount: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 21,
  },

  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 24,
  },

  // 장식용 일러스트 이미지
  illustrationImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 136,
    height: 136,
  },

  // ===== Review List =====
  reviewList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },

  // ===== Review Card =====
  reviewCard: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },

  // 우측 상단 장식
  cardDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 60,
    backgroundColor: 'rgba(255, 240, 133, 0.3)',
  },

  // 카드 내용
  cardContent: {
    gap: 12,
  },

  // ===== Card Header (프로필 + 날짜) =====
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // 프로필 영역
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 닉네임 & 별점
  profileInfo: {
    gap: 2,
  },

  nickname: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#1E2939',
    lineHeight: 22.5,
  },

  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // 날짜
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  dateText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    color: '#6A7282',
    lineHeight: 18,
  },

  // ===== Review Content =====
  reviewContent: {
    marginTop: 0,
  },

  reviewText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    color: '#364153',
    lineHeight: 22,
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
