import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Search, ChevronDown, X} from 'lucide-react-native';
import {Portal} from '@gorhom/portal';
import RecipeCard from '../../components/recipeboard/RecipeCard';
import RecipeListItem from '../../components/recipeboard/RecipeListItem';
import styles from '../../styles/screens/recipeboard/RecipeBoardStyles';
import headerClipboardImg from '../../assets/images/main/mianBoard.png';
import {getRecipeBoardList} from '../../api/recipeBoard';
import {useFocusEffect} from '@react-navigation/native';

/* =========================
   프론트 → 백엔드 코드 매핑
========================= */
const STYLE_CODE_MAP = {
  한식: 'KOR',
  중식: 'CHN',
  일식: 'JPN',
  양식: 'WES',
  퓨전: 'ETC',
};

const DIFFICULTY_CODE_MAP = {
  하: 'EASY',
  중: 'NORMAL',
  상: 'HARD',
};

const TIME_TO_MIN_MAP = {
  '10분 이내': 10,
  '30분 이내': 30,
  '1시간 이내': 60,
  '1시간 이상': 999,
};

const RecipeBoardScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [popularRecipes, setPopularRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentFilterType, setCurrentFilterType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFirstMount, setIsFirstMount] = useState(true);

  const slideAnim = useRef(new Animated.Value(300)).current;

  /* =========================
      게시판 목록 조회
  ========================= */
  const fetchRecipeBoard = async () => {
    try {
      setLoading(true);

      // 1️⃣ 인기 레시피 (좋아요 기준)
      const popularRes = await getRecipeBoardList({
        search: searchQuery || undefined,
        cuisineStyleCd: selectedStyle
          ? STYLE_CODE_MAP[selectedStyle]
          : undefined,
        difficultyCd: selectedDifficulty
          ? DIFFICULTY_CODE_MAP[selectedDifficulty]
          : undefined,
        maxCookTimeMin: selectedTime
          ? TIME_TO_MIN_MAP[selectedTime]
          : undefined,
        sort: 'POPULAR',
        page: 1,
        size: 10,
      });

      // 2️⃣ 전체 레시피 (최신순)
      const latestRes = await getRecipeBoardList({
        search: searchQuery || undefined,
        cuisineStyleCd: selectedStyle
          ? STYLE_CODE_MAP[selectedStyle]
          : undefined,
        difficultyCd: selectedDifficulty
          ? DIFFICULTY_CODE_MAP[selectedDifficulty]
          : undefined,
        maxCookTimeMin: selectedTime
          ? TIME_TO_MIN_MAP[selectedTime]
          : undefined,
        sort: 'LATEST',
        page: 1,
        size: 20,
      });

      setPopularRecipes(popularRes.items || []);
      setAllRecipes(latestRes.items || []);
    } catch (error) {
      console.error('게시판 레시피 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  /* 최초 진입 시에만 필터 초기화 */
  useFocusEffect(
    React.useCallback(() => {
      if (isFirstMount) {
        // 최초 진입 시에만 필터 초기화
        setSearchQuery('');
        setSelectedStyle(null);
        setSelectedDifficulty(null);
        setSelectedTime(null);
        setIsFirstMount(false);
      }
      // 필터 상태 유지하면서 데이터만 새로고침
      fetchRecipeBoard();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // 필터 변경 시 자동 새로고침
  useEffect(() => {
    if (!isFirstMount) {
      fetchRecipeBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   fetchRecipeBoard();
  // }, [selectedStyle, selectedDifficulty, selectedTime]);

  /* =========================
      검색
  ========================= */
  const handleSearch = async () => {
    await fetchRecipeBoard();
  };

  /* =========================
      필터 바텀시트
  ========================= */
  const filterOptions = {
    style: ['전체', '한식', '중식', '일식', '양식', '퓨전'],
    difficulty: ['전체', '하', '중', '상'],
    time: ['전체', '10분 이내', '30분 이내', '1시간 이내', '1시간 이상'],
  };

  const openFilterSheet = Type => {
    setCurrentFilterType(Type);
    setIsModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeFilterSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setIsModalVisible(false), 0);
    });
  };

  const handleFilterSelect = value => {
    // "전체" 선택 시 null로 설정하여 필터 해제
    if (currentFilterType === 'style') {
      setSelectedStyle(value === '전체' ? null : value);
    }
    if (currentFilterType === 'difficulty') {
      setSelectedDifficulty(value === '전체' ? null : value);
    }
    if (currentFilterType === 'time') {
      setSelectedTime(value === '전체' ? null : value);
    }

    closeFilterSheet();
  };

  const getFilterTitle = () => {
    if (currentFilterType === 'style') return '요리 스타일';
    if (currentFilterType === 'difficulty') return '난이도';
    if (currentFilterType === 'time') return '조리시간';
    return '';
  };

  const getCurrentValue = () => {
    switch (currentFilterType) {
      case 'style':
        return selectedStyle;
      case 'difficulty':
        return selectedDifficulty;
      case 'time':
        return selectedTime;
      default:
        return null;
    }
  };

  const getCurrentOptions = () => {
    return filterOptions[currentFilterType] || [];
  };

  /* =========================
      상세 이동
  ========================= */
  const handleRecipePress = recipeId => {
    navigation.navigate('RecipeBoardDetail', {
      recipeId,
      from: 'recipeboard',
    });
  };

  /* =========================
      로딩
  ========================= */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#155DFC" />
      </View>
    );
  }

  /* =========================
      렌더링
  ========================= */
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FBB2B2', '#F55E5E', '#FF9494']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={155}
        style={styles.headerGradient}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {/* 제목 */}
            <View style={{paddingLeft: 0}}>
              <Text style={styles.headerTitle}>레시피 게시판</Text>
              <Text style={styles.headerSubtitle}>
                공유된 레시피를 확인하세요!
              </Text>
            </View>

            {/* 검색 */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="검색어를 입력해주세요."
                placeholderTextColor="#A1A1A1"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}>
                <LinearGradient
                  colors={['#00D3F2', '#2B7FFF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.searchButton}>
                  <Search size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* 필터 */}
            {/* 필터 칩 */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => openFilterSheet('style')}>
                <Text style={styles.filterChipText}>
                  {selectedStyle || '요리스타일'}
                </Text>
                <ChevronDown size={14} color="#404040" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => openFilterSheet('difficulty')}>
                <Text style={styles.filterChipText}>
                  {selectedDifficulty || '난이도'}
                </Text>
                <ChevronDown size={14} color="#404040" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => openFilterSheet('time')}>
                <Text style={styles.filterChipText}>
                  {selectedTime || '조리시간'}
                </Text>
                <ChevronDown size={14} color="#404040" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Image
          source={headerClipboardImg}
          style={styles.headerImage}
          resizeMode="contain"
        />

        {/* 메인 콘텐츠 */}
        <View style={styles.contentContainer}>
          {/* 인기 레시피 섹션 */}
          <View style={styles.popularSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>인기 레시피</Text>
              <View style={styles.sectionDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dotLong} />
              </View>
            </View>
            {popularRecipes.length > 0 ? (
              <FlatList
                data={popularRecipes}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                decelerationRate="fast"
                keyExtractor={item => item.recipeId.toString()}
                renderItem={({item}) => (
                  <View style={{width: 320, padding: 5}}>
                    <RecipeCard
                      recipe={item}
                      onPress={() => handleRecipePress(item.recipeId)}
                    />
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>인기 레시피가 없습니다.</Text>
              </View>
            )}
          </View>

          {/* 전체 레시피 섹션 */}
          <View style={styles.allRecipesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>전체 레시피</Text>
            </View>

            {allRecipes.length > 0 ? (
              <View style={styles.allRecipesList}>
                {allRecipes.map(recipe => (
                  <RecipeListItem
                    key={recipe.recipeId}
                    recipe={recipe}
                    onPress={() => handleRecipePress(recipe.recipeId)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>레시피가 없습니다.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 필터 바텀시트 */}
      <Portal>
        {isModalVisible && (
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getFilterTitle()}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeFilterSheet}>
                <X size={24} color="#404040" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {getCurrentOptions().map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterOption,
                    getCurrentValue() === option && styles.filterOptionSelected,
                  ]}
                  onPress={() => handleFilterSelect(option)}>
                  <Text
                    style={[
                      styles.filterOptionText,
                      getCurrentValue() === option &&
                        styles.filterOptionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </Portal>
    </View>
  );
};

export default RecipeBoardScreen;