import {StyleSheet} from 'react-native';
import {colors} from '../../common';

/**
 * 추천 레시피 화면 전용 스타일
 */
export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 상단 그라데이션 헤더
  header: {
    height: 80,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 24,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },

  headerSpacer: {
    width: 40,
  },

  // 필터 정보 박스 (스크롤뷰 내부)
  filterInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  filterInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'Noto Sans KR',
  },

  filterInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0092B8',
    fontFamily: 'Noto Sans KR',
  },

  // 레시피 목록
  recipeList: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 20,
  },

  recipeListContent: {
    paddingBottom: 140, // 하단 네비게이션 공간
  },

  // 레시피 카드
  recipeCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  recipeImageContainer: {
    height: 160,
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recipeImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  recipePlaceholderIcon: {
    width: 48,
    height: 48,
  },

  recipeInfo: {
    padding: 20,
  },

  recipeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Noto Sans KR',
  },

  recipeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  recipeDifficulty: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'Noto Sans KR',
  },

  recipeDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 12,
  },

  recipeTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'Noto Sans KR',
  },

  selectButton: {
    height: 41,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },

  // 로딩 상태
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Noto Sans KR',
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Noto Sans KR',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0092B8',
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },
});

export default styles;
