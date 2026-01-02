import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/screens/recipeboard/RecipeDetailStyles';
import {getRecipeBoardDetail, toggleRecipeLike} from '../../api/recipeBoard';
import {
  ChevronLeft,
  Flag,
  Heart,
  Camera as CameraIcon,
  Check,
} from 'lucide-react-native';
import ReportModal from '../../components/common/ReportModal';

/**
 * 레시피 게시판 상세 화면
 * - 마운트 시 API로 상세 정보 로드
 * - 좋아요 토글 기능
 * - 필요한 재료, 조리 순서 표시
 */
export default function RecipeDetailScreen({route, navigation}) {
  const [userId, setUserId] = useState(null);
  const {recipeId, recipe: initialRecipe, from} = route.params || {};
  const [recipe, setRecipe] = useState(initialRecipe);
  const [liked, setLiked] = useState(!!initialRecipe?.isLiked);
  const [likeCount, setLikeCount] = useState(initialRecipe?.likeCount || 0);
  const [loading, setLoading] = useState(false);
  const [isMyRecipe, setIsMyRecipe] = useState(false); // 내 글 여부
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const headerColors = ['#FBB2B2', '#F55E5E']; // 게시판 전용 그라디엘트
  const stepNumberColors = ['#00D3F2', '#2B7FFF']; // 조리 순서 번호 그라디엘트

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

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem('userId');
        if (stored) setUserId(Number(stored));
      } catch (e) {
        console.error('userId 로드 실패:', e);
      }
    };
    loadUserId();
  }, []);

  // 현재 사용자 확인 (내 글인지 체크)
  useEffect(() => {
    checkIsMyRecipe();
  }, [recipe]);

  // 레시피 상세 정보 로드
  useEffect(() => {
    if (!initialRecipe && recipeId) {
      loadRecipeDetail();
    }
  }, [recipeId]);

  const checkIsMyRecipe = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId && recipe?.ownerUserId === Number(storedUserId)) {
        setIsMyRecipe(true);
      } else {
        setIsMyRecipe(false);
      }
    } catch (error) {
      console.error('사용자 정보 확인 실패:', error);
      setIsMyRecipe(false);
    }
  };

  const loadRecipeDetail = async () => {
    try {
      setLoading(true);

      const data = await getRecipeBoardDetail(recipeId);
      console.log('📦 상세 응답:', data);

      setRecipe(data);
      setLiked(data.likedByMe);
      setLikeCount(data.likeCnt);
    } catch (error) {
      console.error('레시피 상세 조회 실패:', error);
      Alert.alert('오류', '레시피를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    try {
      if (!userId) {
        console.warn('❌ userId 없음');
        return;
      }
      const rid = recipe?.recipeId ?? recipeId;
      if (!rid) {
        console.warn('❌ recipeId 없음');
        return;
      }

      const isLiked = await toggleRecipeLike(rid, userId);

      setLiked(isLiked);
      setLikeCount(prev => (isLiked ? prev + 1 : Math.max(0, prev - 1)));

      console.log('✅ 좋아요 토글 성공:', {userId, recipeId: rid, isLiked});
    } catch (error) {
      console.error('❌ 좋아요 토글 실패:', error);
    }
  };

  // 신고하기 핸들러
  const handleReport = () => {
    setIsReportModalVisible(true);
  };

  // 신고 모달 닫기
  const handleReportModalClose = () => {
    setIsReportModalVisible(false);
  };

  // 신고 제출 완료 후 처리
  const handleReportSubmit = async () => {
    // ReportModal 내부에서 이미 API 호출 완료
    setIsReportModalVisible(false);
  };

  // reportTarget 객체 생성
  const reportTarget = {
    type: 'recipe',
    id: recipe?.recipeId || recipeId,
    name: recipe?.title || '알 수 없음',
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F55E5E" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>레시피 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const ingredients = recipe.ingredients || [];

  const steps = recipe.steps || [
    '소고기를 한입 크기로 썰어주세요.',
    '양파를 채썰어 준비합니다.',
    '팬에 기름을 두르고 소고기를 볶습니다.',
    '양파를 넣고 함께 볶아주세요.',
    '간장으로 간을 맞춰 완성합니다.',
  ];

  return (
    <View style={styles.container}>
      {/* 상단 그라데이션 헤더 */}
      <LinearGradient
        colors={headerColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (from === 'recipeboard') {
                  navigation.navigate('RecipeBoard');
                } else if (from === 'recipeSave') {
                  navigation.navigate('SavedRecipes');
                } else {
                  navigation.navigate('SharedRecipes');
                }
              }}>
              <ChevronLeft size={24} color="#F55E5E" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {recipe.title}
              </Text>
              <View style={styles.headerMetadata}>
                <Text style={styles.metadataText}>
                  {getDifficultyText(recipe.difficultyCd)}
                </Text>
                <View style={styles.metadataDivider} />
                <Text
                  style={styles.metadataText}>{`${recipe.cookTimeMin}분`}</Text>
              </View>
            </View>
          </View>
          {!isMyRecipe && (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={handleLikeToggle}>
              <Heart
                size={24}
                color={liked ? '#FF4D6D' : '#F55E5E'}
                fill={liked ? '#FF4D6D' : 'none'}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* 컨텐츠 */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        {/* 레시피 이미지 (최상단) */}
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
              size={64}
              style={styles.recipePlaceholderIcon}
            />
          )}
        </View>
        {/* 필요한 재료 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>필요한 재료</Text>
          <View style={styles.ingredientsList}>
            {recipe?.recipeIngredients?.map(ingredient => (
              <View
                key={`${ingredient.ingredientName}-${ingredient.quantityDesc}`}
                style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>
                  {ingredient.ingredientName}
                </Text>
                <Text style={styles.ingredientAmount}>
                  {ingredient.quantityDesc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 조리 순서 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>조리 순서</Text>
          <View style={styles.stepsList}>
            {recipe?.recipeSteps?.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <LinearGradient
                  colors={stepNumberColors}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </LinearGradient>
                <Text style={styles.stepText}>{step.stepDesc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 신고하기 버튼 (내 글이 아닐 때만 표시) */}
        {!isMyRecipe && (
          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Flag size={16} color="#9CA3AF" />
            <Text style={styles.reportText}>신고하기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 신고 모달 */}
      <ReportModal
        visible={isReportModalVisible}
        onClose={handleReportModalClose}
        reportTarget={reportTarget}
        onSubmit={handleReportSubmit}
      />
    </View>
  );
}
