import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

/**
 * 메인 홈 화면 전용 스타일
 */
export const homeStyles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120, // 하단 네비게이션 공간
  },

  content: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },

  // 헤더
  headerContainer: {
    marginBottom: 4,
    paddingBottom: 0,
    paddingTop: 16,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#12175E',
    lineHeight: 42,
    marginBottom: 4,
  },

  subGreeting: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6A7282',
    lineHeight: 21,
    marginBottom: 0,
  },

  // 섹션 타이틀
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#12175E',
    lineHeight: 30,
    marginBottom: 20,
    marginTop: 20,
  },

  sectionTitleMenu: {
    fontSize: 20,
    fontWeight: '700',
    color: '#12175E',
    lineHeight: 30,
    marginBottom: 20,
    marginTop: 20,
  },
  // 메뉴 섹션
  menuSection: {
    marginBottom: 0,
    paddingTop: 0,
  },

  menuRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },

  // 메뉴 카드
  menuCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'flex-end',
    overflow: 'visible',
    position: 'relative',
  },

  // 첫번째 행 카드 높이
  menuCardRow1: {
    height: 180,
  },

  // 두번째 행 카드 높이
  menuCardRow2Left: {
    height: 120,
  },

  menuCardRow2Right: {
    height: 120,
  },

  menuCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: 0,
  },

  menuCardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textWhite,
  },

  menuCardTitleDark: {
    color: '#12175E',
  },

  menuCardSubtitleDark: {
    color: '#000000',
  },

  // 냉장고 털기 (청록색)
  fridgeCard: {
    backgroundColor: '#7DC8E7',
    height: 180,
  },

  fridgeImage: {
    position: 'absolute',
    top: -15,
    left: -29,
    overflow: 'visible',
  },

  // 레시피 찾기 (보라색)
  recipeSearchCard: {
    backgroundColor: '#8B7DD8',
    height: 116,
  },

  recipeSearchImage: {
    position: 'absolute',
    top: -37,
    right: -13,
  },

  // 레시피 게시판 (핑크색)
  recipeBoardCard: {
    backgroundColor: '#F19DB5',
    height: 120,
  },

  recipeBoardImage: {
    position: 'absolute',
    top: -7,
    left: -21,
  },

  // 같이 장보기 (연두색)
  shoppingCard: {
    backgroundColor: '#B5E7A0',
    height: 174,
  },

  shoppingImage: {
    position: 'absolute',
    bottom: -7,
    right: -17,
  },

  // 오른쪽 위 화살표 장식
  cardArrowDecoration: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 60,
    height: 60,
    overflow: 'hidden',
  },

  // 화살표 아이콘
  arrowIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 20,
    height: 20,
    zIndex: 1,
  },

  // 인기 레시피 섹션
  popularSection: {
    marginBottom: 0,
  },

  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  moreButton: {
    paddingVertical: 4,
  },

  moreButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#393F93',
    marginTop: 20,
  },

  // 인기 레시피 카드
  popularRecipeCard: {
    backgroundColor: colors.bgWhite,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    ...shadows.cardSmall,
  },

  recipeImage: {
    width: 85,
    height: 85,
    borderRadius: 14,
    backgroundColor: '#ffeaeaff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  recipeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },

  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
    marginLeft: 32,
  },

  recipeAuthor: {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  recipeAuthorText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#999999',
  },

  recipeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  recipeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  recipeDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recipeMetadataText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#666666',
    marginLeft: 3,
  },

  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00A63E',
  },

  // 재료 태그
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },

  ingredientTag: {
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  ingredientTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#E91E63',
  },

  moreIngredientsTag: {
    backgroundColor: '#F0F0F0',
  },

  moreIngredientsText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
  },

  // 좋아요 영역
  likeSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 6,
  },

  likeButton: {
    padding: 4,
  },

  likeCount: {
    fontSize: 11,
    fontWeight: '400',
    color: '#999999',
    marginTop: 2,
  },

  // 순위 배지
  rankBadge: {
    position: 'absolute',
    left: -5,
    top: -4,
  },
});

export default homeStyles;
