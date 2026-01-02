import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import {Keyboard, Package, ChevronRight, Settings} from 'lucide-react-native';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import styles from '../../styles/screens/recipe/RecipeSelectionScreenStyles';

const RecipeSelectionScreen = ({navigation}) => {
  const handleDirectInput = () => {
    navigation.navigate('IngredientInput');
  };

  const handleMyIngredients = () => {
    // 내 재료로 추천받기 - 레시피 필터 화면으로 이동 (카메라 플로우와 동일)
    // 향후: 사용자의 저장된 재료 목록을 전달하도록 구현
    navigation.navigate('RecipeFilter', {
      ingredients: [], // 추후 AsyncStorage 또는 API에서 가져온 재료 목록
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

      {/* 컨텐츠 */}
      <View style={styles.content}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>레시피 추천</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color="white" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 안내 문구 */}
        <Text style={styles.subtitle}>
          어떤 방법으로 레시피를 추천받으시겠어요?
        </Text>

        {/* 선택 카드들 */}
        <View style={styles.cardsContainer}>
          {/* 직접 입력으로 추천받기 */}
          <TouchableOpacity
            style={styles.cardLarge}
            onPress={handleDirectInput}
            activeOpacity={0.8}>
            <View style={[styles.iconContainer, styles.iconBlue]}>
              <Keyboard color="white" size={30} strokeWidth={2} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>직접 입력으로 추천받기</Text>
              <Text style={styles.cardDescription}>
                재료를 직접 입력하고 필터를 설정해요
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={24} strokeWidth={2} />
          </TouchableOpacity>

          {/* 내 재료로 추천받기 */}
          <TouchableOpacity
            style={styles.card}
            onPress={handleMyIngredients}
            activeOpacity={0.8}>
            <View style={[styles.iconContainer, styles.iconGreen]}>
              <Package color="white" size={30} strokeWidth={2} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>내 재료로 추천받기</Text>
              <Text style={styles.cardDescription}>
                저장된 재료 목록에서 선택해요
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RecipeSelectionScreen;
