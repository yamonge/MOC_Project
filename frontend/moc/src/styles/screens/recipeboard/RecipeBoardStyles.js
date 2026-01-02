import {StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../../common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 상단 헤더 영역
  header: {
    height: 277,
    width: '100%',
    paddingTop: 52,
    paddingHorizontal: 24,
    overflow: 'hidden',
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    gap: 9,
  },

  // 헤더 타이틀
  headerTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 36,
    marginLeft: 10,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginLeft: 10,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // 검색 바 영역
  searchContainer: {
    marginTop: 32,
    position: 'relative',
  },
  searchInput: {
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 50,
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: colors.textDark,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  searchInputPlaceholder: {
    color: '#A1A1A1',
  },
  searchButton: {
    position: 'absolute',
    right: 3,
    top: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: colors.white,
  },

  // 필터 칩 영역
  filterContainer: {
    marginTop: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    minWidth: 100,
    justifyContent: 'center',
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    color: '#404040',
  },
  filterChipIcon: {
    width: 14,
    height: 14,
  },

  // 헤더 이미지 (클립보드 이미지)
  headerImage: {
    position: 'absolute',
    right: 0,
    top: 22,
    width: 173,
    height: 107,
  },

  // 메인 콘텐츠 영역
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textBlack,
  },
  sectionDots: {
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D3F3',
  },
  dotLong: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D3F3',
  },

  // 인기 레시피 섹션
  popularSection: {
    marginBottom: 24,
  },

  // 전체 레시피 섹션
  allRecipesSection: {
    flex: 1,
  },
  allRecipesList: {
    paddingBottom: 100, // 하단 네비게이션 공간
  },

  // 로딩
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    color: colors.textLightGray,
    marginTop: 12,
  },

  // 필터 바텀시트
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    color: colors.textBlack,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textDark,
  },
  filterOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  filterOptionTextSelected: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#155DFC',
  },
});
