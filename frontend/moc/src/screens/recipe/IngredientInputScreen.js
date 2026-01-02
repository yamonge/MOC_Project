import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ChevronLeft, Plus, X, ChevronRight} from 'lucide-react-native';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import styles from '../../styles/screens/recipe/IngredientInputScreenStyles';

const IngredientInputScreen = ({navigation}) => {
  const [inputText, setInputText] = useState('');
  const [ingredients, setIngredients] = useState([]);

  // 재료 추가
  const handleAddIngredient = () => {
    if (inputText.trim()) {
      setIngredients([...ingredients, inputText.trim()]);
      setInputText('');
    }
  };

  // 재료 삭제
  const handleRemoveIngredient = index => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // 다음 단계로 (레시피 필터 화면으로 이동)
  const handleNext = () => {
    if (ingredients.length === 0) {
      // 안내: 재료를 최소 1개 이상 입력해주세요
      return;
    }
    // 재료를 객체 배열로 변환 (IngredientSelectionScreen이 기대하는 형식)
    const ingredientsWithId = ingredients.map((name, index) => ({
      id: `ingredient-${index}`,
      name: name,
    }));

    // 레시피 필터 화면으로 이동 (레시피->직접입력 플로우)
    navigation.navigate('RecipeFilter', {
      ingredients: ingredientsWithId,
      from: 'recipe-direct-input',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 배경 */}
      <AnimatedBackground />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeft color="white" size={20} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>재료 입력</Text>
      </View>

      {/* 안내 문구 */}
      <Text style={styles.subtitle}>가지고 있는 재료를 입력해주세요</Text>

      {/* 컨텐츠 영역 - ScrollView로 감싸기 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* 재료 입력 카드 */}
        <View style={styles.inputCard}>
          {/* 입력 필드 + 추가 버튼 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="예: 소고기, 양파, 당근"
              placeholderTextColor="#A1A1A1"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
              activeOpacity={0.8}>
              <Plus color="white" size={22} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* 입력된 재료 칩 목록 */}
          <View style={styles.chipsContainer}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{ingredient}</Text>
                <TouchableOpacity
                  style={styles.chipRemoveButton}
                  onPress={() => handleRemoveIngredient(index)}
                  activeOpacity={0.8}>
                  <X color="#007595" size={12} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 다음 버튼 - 절대 위치로 고정 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            ingredients.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={ingredients.length === 0}>
          <Text style={styles.nextButtonText}>다음 단계로</Text>
          <ChevronRight color="white" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IngredientInputScreen;
