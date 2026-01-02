import {StyleSheet} from 'react-native';
import {colors, typography} from '../../common';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // 이미지 영역
  imageContainer: {
    width: '100%',
    height: 192,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 좋아요 버튼 (우측 상단)
  likeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeIcon: {
    width: 20,
    height: 20,
  },

  // 좋아요 수 (우측 중단)
  likeCount: {
    position: 'absolute',
    width: 40,
    right: 12,
    top: 56,
    backgroundColor: colors.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeCountText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textBlack,
  },

  // 정보 영역
  infoContainer: {
    padding: 16,
  },

  // 레시피 제목
  recipeTitle: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#0A0A0A',
    marginBottom: 12,
  },

  // 소유자 정보
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ownerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ownerAvatarIcon: {
    width: 14,
    height: 14,
  },
  ownerLabel: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#4A5565',
  },
  ownerName: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#0A0A0A',
  },

  // 상세 정보 (조리시간, 난이도)
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    width: 16,
    height: 16,
  },
  detailLabel: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#4A5565',
  },
  detailValue: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#0A0A0A',
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

  // 재료 영역
  ingredientsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 13,
  },
  ingredientsLabel: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#4A5565',
    marginBottom: 8,
  },
  ingredientsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientChip: {
    backgroundColor: '#FDF2F8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ingredientText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#155DFC',
  },
});
