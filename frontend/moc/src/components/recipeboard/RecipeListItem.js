import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Heart, User, Clock} from 'lucide-react-native';
import styles from '../../styles/components/recipeboard/RecipeListItemStyles';

const RecipeListItem = ({recipe, onPress, hideLike = false}) => {
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
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* 이미지 */}
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
      </View>

      {/* 정보 영역 */}
      <View style={styles.infoContainer}>
        {/* 제목 */}
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {recipe.title}
        </Text>

        {/* 작성자 */}
        <View style={styles.authorContainer}>
          <User size={12} color="#6A7282" />
          <Text style={styles.authorText} numberOfLines={1}>
            {recipe.authorNickname}
          </Text>
        </View>

        {/* 상세 정보 */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Clock size={12} color="#4A5565" />
            <Text style={styles.detailText}>{recipe.cookTimeMin}분</Text>
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

        {/* 재료 칩 */}
        <View style={styles.ingredientsContainer}>
          {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{item.ingredientName}</Text>
              </View>
            ))}
          {recipe.ingredients && recipe.ingredients.length > 3 && (
            <View style={styles.moreChip}>
              <Text style={styles.moreText}>
                +{recipe.ingredients.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 좋아요 영역 (표시만) - hideLike가 false일 때만 표시 */}
      {!hideLike && (
        <View style={styles.likeContainer}>
          <View style={styles.likeButton}>
            <Heart
              size={20}
              color={recipe.likedByMe ? '#FF2056' : '#D1D5DB'}
              fill={recipe.likedByMe ? '#FF2056' : 'none'}
            />
          </View>
          <Text style={styles.likeCount}>{recipe.likeCnt || 0}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RecipeListItem;
