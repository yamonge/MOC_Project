import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Send, Star, Share2} from 'lucide-react-native';
import RecipeListItem from '../../components/recipeboard/RecipeListItem';
import {getSharedRecipes} from '../../api/mypage';
import styles from '../../styles/screens/mypage/SharedRecipesStyles';
import {colors} from '../../styles/common';

/**
 * 공유한 레시피 화면
 *
 * 기능:
 * - 내가 공유한 레시피 목록 표시
 * - RecipeListItem 컴포넌트 재사용 (좋아요 버튼 표시)
 * - 레시피 카드 클릭 시 상세보기 이동
 */
export default function SharedRecipesScreen({navigation}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadRecipes();
  }, []);

  // 레시피 목록 불러오기
  const loadRecipes = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('userId');
      console;
      if (!userId) {
        setRecipes([]);
        setTotalCount(0);
        return;
      }

      const response = await getSharedRecipes(userId);
      console.log('✅ [SharedRecipesScreen] API raw response:', response);
      const list = response?.bookmarkedRecipes ?? [];
      console.log('[SharedRecipes] bookmarkedRecipes length:', list.length);
      console.log('[SharedRecipes] first item:', list[0]);
      setRecipes(
        list
          .filter(item => item?.recipe)
          .map(item => {
            const r = item.recipe;
            return {
              recipeId: r.recipeId, // ← id 말고
              title: r.title,
              authorNickname: r.authorNickname,
              cookTimeMin: r.cookTimeMin,
              difficultyCd: r.difficultyCd,
              thumbnailUrl: r.thumbnailUrl,
              likeCnt: r.likeCnt,
              isLiked: false,
              createdDate: item.createdDate,
            };
          }),
      );
      setTotalCount(response?.totalCount ?? 0);
    } catch (error) {
      console.error('공유한 레시피 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 레시피 카드 클릭 핸들러
  const handleRecipePress = recipeId => {
    navigation.navigate('RecipeBoardDetail', {
      recipeId: recipeId,
      from: 'shareBoard',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 상단 헤더 */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#7371FC', '#8677D9', '#B99DD8']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            angle={175.64}
            style={styles.headerGradient}
          />

          {/* 배경 장식 아이콘들 */}
          <View style={[styles.decorIcon, styles.decorIcon1]}>
            <Send size={48} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
          </View>
          <View style={[styles.decorIcon, styles.decorIcon2]}>
            <Share2
              size={28}
              color="rgba(255, 255, 255, 0.3)"
              strokeWidth={2}
            />
          </View>
          <View style={[styles.decorIcon, styles.decorIcon3]}>
            <Star
              size={42}
              color="rgba(255, 255, 255, 0.3)"
              strokeWidth={2}
              fill="rgba(255, 255, 255, 0.3)"
            />
          </View>

          {/* 타이틀 영역 */}
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}>
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>공유한 레시피</Text>
          </View>

          {/* 통계 정보 */}
          <View style={styles.headerStats}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalCount}개</Text>
            </View>
            <Send size={16} fill="#FFF" color="#FFF" />
          </View>

          {/* 장식용 일러스트 (추후 에셋 추가 시 활성화) */}
          <Image
            source={require('../../assets/images/mypage/share.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 콘텐츠 섹션 */}
        <View style={styles.contentSection}>
          {/* 레시피 리스트 */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.recipeListContainer}>
              {recipes.length > 0 ? (
                recipes.map(item => (
                  <RecipeListItem
                    key={item.recipeId}
                    recipe={item}
                    onPress={() => handleRecipePress(item.recipeId)}
                    hideLike={true}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    공유한 레시피가 없습니다.{'\n'}나만의 레시피를 공유해보세요!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
