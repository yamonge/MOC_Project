import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import {ChevronLeft, Camera as CameraIcon} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../../styles/screens/camera/recommendedRecipesStyles.js';
import {recommendRecipes} from '../../api/camera';

/**
 * 추천 레시피 화면
 * AI가 선택한 재료와 필터를 기반으로 레시피를 추천하는 화면
 *
 * Route Params:
 * - ingredients: 선택한 재료 목록 [{id, name, usage, amount, checked}, ...]
 * - filters: 필터 정보 {style, difficulty, time}
 */
export default function RecommendedRecipesScreen({route, navigation}) {
  const {ingredients = [], filters = {}, from = 'camera'} = route.params || {};

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // refresh param이 변경될 때만 AI 레시피 추천 API 호출
  useEffect(() => {
    const currentRefresh = route.params?.refresh;
    if (currentRefresh && currentRefresh !== lastRefresh) {
      setLastRefresh(currentRefresh);
      fetchRecommendedRecipes();
    }
  }, [route.params?.refresh]);

  /**
   * AI 레시피 추천 API 호출
   */
  const fetchRecommendedRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AsyncStorage.removeItem('savedRecipes');
    } catch (e) {
      console.error(e);
    }

    const selectedIngredients = ingredients.filter(item => item.checked);

    if (!Array.isArray(selectedIngredients)) {
      setError('선택된 재료 정보가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    const userId = await AsyncStorage.getItem('userId');

    const result = await recommendRecipes(
      Number(userId),
      selectedIngredients,
      filters,
    );
    console.log('recommendRecipes result =', result);
    if (result.success) {
      setRecipes(result.recipes);
      console.log('🍳 추천 레시피:', result.recipes);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  /**
   * 레시피 선택 핸들러
   * 레시피 상세 화면으로 이동 (카메라 플로우 7단계)
   * 전체 레시피 데이터를 전달하여 추가 API 호출 방지
   */
  const handleSelectRecipe = recipe => {
    console.log('🍳 레시피 선택:', recipe);

    // 이 레시피에 필요한 재료 이름 목록
    const recipeIngredientNames = recipe.requiredIngredients.map(ing =>
      ing.ingredientName.toLowerCase(),
    );

    // 사용자 재료 중 이 레시피에 필요한 것만 필터링
    const recipeIngredients = ingredients.filter(item =>
      recipeIngredientNames.includes(item.name.toLowerCase()),
    );

    console.log('🔍 recipeIngredients:', recipeIngredients);

    // 레시피 상세 화면으로 이동 (레시피에 필요한 재료만 전달)
    navigation.navigate('RecipeDetail', {
      recipe, // 전체 레시피 데이터 전달 (API 재호출 불필요)
      ingredients: recipeIngredients, // ✅ 이 레시피에 필요한 재료만 (id, usage 포함)
      from, // from prop 전달
    });
  };

  /**
   * 난이도 한글 변환
   */
  const getDifficultyText = code => {
    switch (code) {
      case 'EASY':
        return '쉬움';
      case 'NORMAL':
        return '보통';
      case 'HARD':
        return '어려움';
      default:
        return code;
    }
  };

  /**
   * 필터 정보 텍스트 생성
   */
  const getFilterText = () => {
    const {style, difficulty, time} = filters;
    return (
      <>
        <Text style={styles.filterInfoValue}>{style || '전체'}</Text>
        <Text style={styles.filterInfoText}>
          {' '}
          · {difficulty || '보통'} · {time || '30분'}
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 상단 그라데이션 헤더 */}
      <LinearGradient
        colors={['#00B8DB', '#155DFC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerTop}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('IngredientSelection', {
                ingredients,
                filters,
                from, // from prop 전달
              })
            }>
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>

          {/* 타이틀 */}
          <Text style={styles.headerTitle}>추천 레시피</Text>

          {/* 오른쪽 공백 (중앙 정렬용) */}
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* 레시피 목록 */}
      {isLoading ? (
        // 로딩 상태
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0092B8" />
          <Text style={styles.loadingText}>
            AI가 레시피를 추천하고 있습니다...
          </Text>
        </View>
      ) : error ? (
        // 에러 상태
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRecommendedRecipes}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : recipes.length === 0 ? (
        // 빈 상태
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            추천할 레시피가 없습니다.{'\n'}다른 조건으로 시도해보세요.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>다시 선택하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 레시피 카드 목록
        <ScrollView
          style={styles.recipeList}
          contentContainerStyle={styles.recipeListContent}
          showsVerticalScrollIndicator={false}>
          {/* 필터 정보 박스 */}
          <View style={styles.filterInfoContainer}>
            <Text style={styles.filterInfoText}>
              선택한 필터: {getFilterText()}
            </Text>
          </View>

          {recipes.map(recipe => (
            <View
              key={`${recipe.title}-${recipe.category}-${recipe.cookTimeMin}`}
              style={styles.recipeCard}>
              {/* 레시피 이미지 또는 플레이스홀더 */}
              <View style={styles.recipeImageContainer}>
                {recipe.thumbnailUrl ? (
                  <Image
                    source={{uri: recipe.thumbnailUrl}}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                ) : (
                  <CameraIcon
                    color="#D1D5DB"
                    size={48}
                    style={styles.recipePlaceholderIcon}
                  />
                )}
              </View>

              {/* 레시피 정보 */}
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>

                <View style={styles.recipeMetadata}>
                  <Text style={styles.recipeDifficulty}>
                    {recipe.difficultyText}
                  </Text>
                  <View style={styles.recipeDivider} />
                  <Text style={styles.recipeTime}>{recipe.cookTimeMin}분</Text>
                </View>

                {/* 선택하기 버튼 */}
                <TouchableOpacity onPress={() => handleSelectRecipe(recipe)}>
                  <LinearGradient
                    colors={['#00B8DB', '#155DFC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>선택하기</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
