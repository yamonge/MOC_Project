import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Heart, User, Clock} from 'lucide-react-native';
import styles from '../../styles/components/recipeboard/RecipeCardStyles';

const RecipeCard = ({recipe, onPress}) => {
  const getDifficultyStyle = difficulty => {
    switch (difficulty) {
      case '하':
        return styles.difficultyEasy;
      case '중':
        return styles.difficultyMedium;
      case '상':
        return styles.difficultyHard;
      default:
        return styles.difficultyMedium;
    }
  };
  const DIFFICULTY_LABEL_MAP = {
    EASY: '하',
    NORMAL: '중',
    HARD: '상',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* 이미지 영역 */}
      <View style={styles.imageContainer}>
        <Image
          source={
            recipe.thumbnailUrl
              ? {uri: recipe.thumbnailUrl}
              : require('../../assets/images/noImage.png')
          }
          style={styles.recipeImage}
          resizeMode="cover"
        />

        {/* 좋아요 아이콘 (표시만) */}
        <View style={styles.likeButton}>
          <Heart
            size={20}
            color={recipe.likedByMe ? '#FF2056' : '#D1D5DB'}
            fill={recipe.likedByMe ? '#FF2056' : 'none'}
          />
        </View>

        {/* 좋아요 수 */}
        <View style={styles.likeCount}>
          <Text style={styles.likeCountText}>{recipe.likeCnt || 0}</Text>
        </View>
      </View>

      {/* 정보 영역 */}
      <View style={styles.infoContainer}>
        {/* 레시피 제목 */}
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {recipe.title}
        </Text>

        {/* 소유자 정보 */}
        <View style={styles.ownerContainer}>
          <View style={styles.ownerAvatar}>
            {recipe.authorProfileImageUrl ? (
              <Image
                source={{uri: recipe.authorProfileImageUrl}}
                style={styles.ownerAvatarImage}
              />
            ) : (
              <User size={14} color="#9CA3AF" />
            )}
          </View>
          <Text style={styles.ownerLabel}>소유자:</Text>
          <Text style={styles.ownerName} numberOfLines={1}>
            {recipe.authorNickname}
          </Text>
        </View>

        {/* 상세 정보 */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#4A5565" />
            <Text style={styles.detailLabel}>조리시간:</Text>
            <Text style={styles.detailValue}>{recipe.cookTimeMin}분</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>난이도:</Text>
            <Text
              style={[
                styles.detailValue,
                getDifficultyStyle(DIFFICULTY_LABEL_MAP[recipe.difficultyCd]),
              ]}>
              {DIFFICULTY_LABEL_MAP[recipe.difficultyCd]}
            </Text>
          </View>
        </View>

        {/* 재료 */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsLabel}>준비재료:</Text>
          <View style={styles.ingredientsChips}>
            {recipe.ingredients &&
              recipe.ingredients.slice(0, 5).map((item, index) => (
                <View key={index} style={styles.ingredientChip}>
                  <Text style={styles.ingredientText}>
                    {item.ingredientName}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
