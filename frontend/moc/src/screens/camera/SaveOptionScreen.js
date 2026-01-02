import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {ChevronLeft, ChevronRight, Check, Sparkles} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../../styles/screens/camera/saveOptionStyles';
import {addUserIngredient, getUserIngredients} from '../../api/camera';

export default function SaveOptionScreen({route, navigation}) {
  const {ingredients = []} = route.params || {};
  const [isSaving, setIsSaving] = useState(false);

  // 중복 제거 및 재료 저장 공통 함수
  const saveIngredients = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('오류', '로그인 정보가 없습니다.');
      return {success: false};
    }

    if (ingredients.length === 0) {
      Alert.alert('안내', '저장할 재료가 없습니다.');
      return {success: false};
    }

    // ✅ 기존 재료 목록 조회 (중복 체크용)
    const existingResult = await getUserIngredients(Number(userId));
    const existingNames = existingResult.success
      ? existingResult.ingredients.map(ing =>
          ing.ingredientName.toLowerCase().trim(),
        )
      : [];

    // ✅ 중복 제거: 기존에 없는 재료만 필터링
    const newIngredients = ingredients.filter(
      ing => !existingNames.includes(ing.name.toLowerCase().trim()),
    );

    console.log(
      `📦 전체 재료: ${ingredients.length}개, 새로운 재료: ${newIngredients.length}개`,
    );

    if (newIngredients.length === 0) {
      Alert.alert('안내', '이미 저장된 재료입니다.');
      return {success: true, skipped: true};
    }

    // ✅ 새로운 재료만 저장
    let savedCount = 0;
    for (const ingredient of newIngredients) {
      const result = await addUserIngredient(Number(userId), ingredient);
      if (!result.success) {
        Alert.alert(
          '저장 실패',
          `${ingredient.name} 저장 중 오류가 발생했습니다.\n${result.error}`,
        );
        return {success: false};
      }
      savedCount++;
    }

    return {success: true, savedCount, skipped: false};
  };

  //저장만 하기
  const handleSaveOnly = async () => {
    // ✅ 중복 클릭 방지
    if (isSaving) return;

    setIsSaving(true);

    try {
      const result = await saveIngredients();

      if (result.success && !result.skipped) {
        Alert.alert(
          '저장 완료',
          `${result.savedCount}개의 재료가 저장되었습니다.`,
          [
            {
              text: '확인',
              onPress: () => {
                // ✅ 뒤로가기 방지: 화면 스택 초기화
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
              },
            },
          ],
        );
      } else if (result.success && result.skipped) {
        // 중복 재료인 경우 홈으로 이동
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      console.error('❌ 재료 저장 오류:', error);
      Alert.alert('오류', '재료 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  //레시피 추천
  const handleGetRecipe = async () => {
    // ✅ 중복 클릭 방지
    if (isSaving) return;

    setIsSaving(true);

    try {
      const result = await saveIngredients();

      if (result.success) {
        // ✅ 저장 성공 → 필터 화면
        navigation.navigate('RecipeFilter', {ingredients});
      }
    } catch (error) {
      console.error('❌ 재료 저장 오류:', error);
      Alert.alert('오류', '재료 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 상단 헤더 (그라데이션) */}
      <LinearGradient
        colors={['#00B8DB', '#155DFC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('IngredientResult', route.params)
            }>
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>저장 옵션</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* 인식 완료 카드 */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Check color="#10B981" size={20} />
            <Text style={styles.completionTitle}>인식 완료</Text>
          </View>
          <Text style={styles.completionText}>
            총{' '}
            <Text style={styles.completionCount}>{ingredients.length}개</Text>의
            재료가 인식되었습니다
          </Text>
        </View>

        {/* 옵션 버튼들 */}
        <View style={styles.optionsContainer}>
          {/* 저장만 하기 */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleSaveOnly}
            activeOpacity={0.7}
            disabled={isSaving}>
            <LinearGradient
              colors={['#00D084', '#00B86D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.iconContainer}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Check color="#FFFFFF" size={30} />
              )}
            </LinearGradient>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>저장만 하기</Text>
              <Text style={styles.optionDescription}>
                내 재료에 저장하고 종료해요
              </Text>
            </View>
            {!isSaving && <ChevronRight color="#9CA3AF" size={24} />}
          </TouchableOpacity>

          {/* 레시피 추천받기 */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleGetRecipe}
            activeOpacity={0.7}
            disabled={isSaving}>
            <LinearGradient
              colors={['#E879F9', '#C026D3']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.iconContainer}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Sparkles color="#FFFFFF" size={30} />
              )}
            </LinearGradient>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>레시피 추천받기</Text>
              <Text style={styles.optionDescription}>
                저장 후 바로 레시피를 추천받아요
              </Text>
            </View>
            {!isSaving && <ChevronRight color="#9CA3AF" size={24} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
