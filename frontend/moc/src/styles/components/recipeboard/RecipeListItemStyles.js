import {StyleSheet} from 'react-native';
import {colors, typography} from '../../common';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },

  // 이미지 영역
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 정보 영역
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // 레시피 제목
  recipeTitle: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#0A0A0A',
    marginBottom: 4,
  },

  // 작성자 정보
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  authorIcon: {
    width: 12,
    height: 12,
  },
  authorText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#6A7282',
  },

  // 상세 정보 (조리시간, 난이도)
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailIcon: {
    width: 12,
    height: 12,
  },
  detailText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#4A5565',
  },
  detailValue: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#4A5565',
  },
  difficultyEasy: {
    color: '#00A63E', // 초록
  },
  difficultyMedium: {
    color: '#F54900', // 주황
  },
  difficultyHard: {
    color: '#FF2056', // 빨강
  },

  // 재료 칩
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  ingredientChip: {
    backgroundColor: '#FDF2F8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ingredientText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#C6005C',
  },
  moreChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  moreText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#4A5565',
  },

  // 우측 좋아요 영역
  likeContainer: {
    alignItems: 'center',
    width: 32,
  },
  likeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
  likeCount: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#6A7282',
  },
});
