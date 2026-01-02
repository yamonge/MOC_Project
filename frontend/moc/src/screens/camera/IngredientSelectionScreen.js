import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ChevronLeft, ChevronRight, Check} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../../styles/screens/camera/ingredientSelectionStyles';
import {getUserIngredients} from '../../api/camera';

export default function IngredientSelectionScreen({route, navigation}) {
  const {ingredients = [], filters = {}, from = 'camera'} = route.params || {};

  // 레시피->직접입력 플로우인지 확인
  const isRecipeDirectInput = from === 'recipe-direct-input';

  // 각 재료의 선택 상태
  const [ingredientStates, setIngredientStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 재료 로드
  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setIsLoading(true);

      // 직접입력으로 들어온 경우 → route.params 사용
      if (isRecipeDirectInput) {
        setIngredientStates(
          ingredients.map(ingredient => ({
            ...ingredient,
            checked: true, // 직접입력은 모두 선택
            usage: '전부 사용',
            amount: '중간',
          })),
        );
      } else {
        // 일반 플로우 → DB에서 전체 재료 조회
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('오류', '로그인 정보가 없습니다.');
          setIngredientStates([]);
          return;
        }

        const result = await getUserIngredients(Number(userId));

        if (result.success) {
          setIngredientStates(
            result.ingredients.map((ing, index) => ({
              id: ing.userIngredientId,
              name: ing.ingredientName,
              checked: index < 3, // 처음 3개만 기본 선택
              usage: '전부 사용',
              amount: '중간',
            })),
          );
        } else {
          Alert.alert('알림', result.error || '재료를 불러올 수 없습니다.');
          setIngredientStates([]);
        }
      }
    } catch (error) {
      console.error('❌ 재료 로드 에러:', error);
      Alert.alert('오류', '재료를 불러오는 중 문제가 발생했습니다.');
      setIngredientStates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 체크박스 토글
  const toggleIngredient = id => {
    setIngredientStates(prev =>
      prev.map(item =>
        item.id === id ? {...item, checked: !item.checked} : item,
      ),
    );
  };

  // 사용량 선택 (일부/전부)
  const selectUsage = (id, usage) => {
    setIngredientStates(prev =>
      prev.map(item => (item.id === id ? {...item, usage} : item)),
    );
  };

  // 양 선택 (조금/중간/많이)
  const selectAmount = (id, amount) => {
    setIngredientStates(prev =>
      prev.map(item => (item.id === id ? {...item, amount} : item)),
    );
  };

  // 레시피 추천받기
  const handleRecommend = () => {
    const selectedIngredients = ingredientStates
      .filter(item => item.checked)
      .map(item => ({
        id: item.id,
        name: item.name,
        usage: item.usage,
        amount: item.amount,
        checked: item.checked,
      }));

    if (selectedIngredients.length === 0) {
      Alert.alert('안내', '최소 1개 이상의 재료를 선택해주세요.');
      return;
    }

    console.log('🎯 레시피 추천 요청:', {
      ingredients: selectedIngredients,
      filters,
    });

    // 기존 추천 화면이 있다면 제거
    if (navigation.canGoBack()) {
      const state = navigation.getState();
      const recommendedRecipesRoute = state.routes.find(
        r => r.name === 'RecommendedRecipes',
      );
      if (recommendedRecipesRoute) {
        navigation.navigate('IngredientSelection');
      }
    }

    // AI 레시피 추천 화면으로 이동 (카메라 플로우 6단계)
    navigation.navigate('RecommendedRecipes', {
      ingredients: selectedIngredients,
      filters,
      from, // from prop 전달
      refresh: Date.now(), // params 변경으로 강제 갱신
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 상단 헤더 */}
      <LinearGradient
        colors={['#00B8DB', '#155DFC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('RecipeFilter', route.params)}>
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>재료 선택</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* 콘텐츠 영역 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: 250}}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          // 로딩 중
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#155DFC" />
            <Text style={[styles.emptyText, {marginTop: 16}]}>
              재료를 불러오는 중...
            </Text>
          </View>
        ) : ingredientStates.length === 0 ? (
          // 재료가 없을 때
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              재료가 없습니다.{'\n'} 재료를 추가해주세요.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.description}>
              각 재료를 얼마나 사용할지 선택해주세요
            </Text>

            {/* 재료 카드 목록 */}
            {ingredientStates.map(ingredient => (
              <View
                key={ingredient.id}
                style={[
                  styles.ingredientCard,
                  ingredient.checked && styles.ingredientCardSelected,
                ]}>
                {/* 재료 헤더 (체크박스 + 이름) */}
                {/* 레시피->직접입력일 때는 체크박스 숨김 */}
                {isRecipeDirectInput ? (
                  <View style={styles.ingredientHeader}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.ingredientHeader}
                    onPress={() => toggleIngredient(ingredient.id)}
                    activeOpacity={0.7}>
                    {ingredient.checked ? (
                      <LinearGradient
                        colors={['#00B8DB', '#155DFC']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.checkbox, styles.checkboxChecked]}>
                        <Check color="#FFFFFF" size={20} />
                      </LinearGradient>
                    ) : (
                      <View
                        style={[styles.checkbox, styles.checkboxUnchecked]}
                      />
                    )}
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  </TouchableOpacity>
                )}

                {/* 사용량 선택 영역 (선택된 재료만 표시) */}
                {ingredient.checked && (
                  <View style={styles.selectionArea}>
                    {/* 일부/전부 사용 (레시피->직접입력일 때는 숨김) */}
                    {!isRecipeDirectInput && (
                      <View style={styles.usageRow}>
                        <TouchableOpacity
                          style={{flex: 1}}
                          onPress={() =>
                            selectUsage(ingredient.id, '일부 사용')
                          }
                          activeOpacity={0.7}>
                          {ingredient.usage === '일부 사용' ? (
                            <LinearGradient
                              colors={['#00B8DB', '#155DFC']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              style={styles.optionButton}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextSelected,
                                ]}>
                                일부 사용
                              </Text>
                            </LinearGradient>
                          ) : (
                            <View
                              style={[
                                styles.optionButton,
                                styles.optionButtonUnselected,
                              ]}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextUnselected,
                                ]}>
                                일부 사용
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flex: 1}}
                          onPress={() =>
                            selectUsage(ingredient.id, '전부 사용')
                          }
                          activeOpacity={0.7}>
                          {ingredient.usage === '전부 사용' ? (
                            <LinearGradient
                              colors={['#00B8DB', '#155DFC']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              style={styles.optionButton}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextSelected,
                                ]}>
                                전부 사용
                              </Text>
                            </LinearGradient>
                          ) : (
                            <View
                              style={[
                                styles.optionButton,
                                styles.optionButtonUnselected,
                              ]}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextUnselected,
                                ]}>
                                전부 사용
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* 조금/중간/많이 */}
                    <View style={styles.amountRow}>
                      {['조금', '중간', '많이'].map(amount => (
                        <TouchableOpacity
                          key={amount}
                          style={{flex: 1}}
                          onPress={() => selectAmount(ingredient.id, amount)}
                          activeOpacity={0.7}>
                          {ingredient.amount === amount ? (
                            <LinearGradient
                              colors={['#00D084', '#00B86D']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 1}}
                              style={styles.optionButton}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextSelected,
                                ]}>
                                {amount}
                              </Text>
                            </LinearGradient>
                          ) : (
                            <View
                              style={[
                                styles.optionButton,
                                styles.optionButtonUnselected,
                              ]}>
                              <Text
                                style={[
                                  styles.optionButtonText,
                                  styles.optionButtonTextUnselected,
                                ]}>
                                {amount}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* 하단 버튼 (재료 유무에 따라 변경) */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          onPress={
            ingredientStates.length === 0
              ? () => navigation.navigate('Home')
              : handleRecommend
          }
          activeOpacity={0.7}
          disabled={isLoading}
          style={{width: '100%'}}>
          <LinearGradient
            colors={
              ingredientStates.length === 0 || isLoading
                ? ['#6B7280', '#4B5563']
                : ['#E879F9', '#C026D3']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.recommendButton}>
            <Text style={styles.recommendButtonText}>
              {ingredientStates.length === 0
                ? '홈으로 가기'
                : '레시피 추천받기'}
            </Text>
            <ChevronRight color="#FFFFFF" size={20} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
