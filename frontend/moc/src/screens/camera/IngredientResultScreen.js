import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Edit2,
  Minus,
  Plus,
  RotateCcw,
  Star,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../../styles/screens/camera/ingredientResultStyles';
import IngredientModal from '../../components/common/IngredientModal';

export default function IngredientResultScreen({route, navigation}) {
  const {photoPath, recognizedIngredients = [], from} = route.params || {};

  // AI 인식 결과 또는 더미 데이터
  const [ingredients, setIngredients] = useState(recognizedIngredients);

  // route.params 변경 시 재료 목록 업데이트
  useEffect(() => {
    setIngredients(recognizedIngredients);
  }, [recognizedIngredients]);

  // 모달 상태
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientInput, setIngredientInput] = useState('');

  // 재료 수정
  const handleEditIngredient = ingredient => {
    setSelectedIngredient(ingredient);
    setIngredientInput(ingredient.name);
    setEditModalVisible(true);
  };

  const confirmEditIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients(prev =>
        prev.map(item =>
          item.id === selectedIngredient.id
            ? {...item, name: ingredientInput.trim()}
            : item,
        ),
      );
      setEditModalVisible(false);
      setIngredientInput('');
      setSelectedIngredient(null);
    }
  };

  // 재료 추가
  const handleAddIngredient = () => {
    setIngredientInput('');
    setAddModalVisible(true);
  };

  const confirmAddIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredient = {
        id: Date.now(),
        name: ingredientInput.trim(),
      };
      setIngredients(prev => [...prev, newIngredient]);
      setAddModalVisible(false);
      setIngredientInput('');
    }
  };

  // 재료 삭제
  const handleDeleteIngredient = ingredient => {
    setSelectedIngredient(ingredient);
    setDeleteModalVisible(true);
  };

  const confirmDeleteIngredient = () => {
    setIngredients(prev =>
      prev.filter(item => item.id !== selectedIngredient.id),
    );
    setDeleteModalVisible(false);
    setSelectedIngredient(null);
  };

  // 재촬영
  const handleRetake = () => {
    // 갤러리에서 왔으면 갤러리로, 아니면 카메라로
    if (from === 'gallery') {
      navigation.navigate('Gallery');
    } else {
      navigation.navigate('Camera');
    }
  };

  // 다음 단계
  const handleNext = () => {
    console.log('다음 단계:', ingredients);
    navigation.navigate('SaveOption', {
      ingredients,
      photoPath,
      recognizedIngredients,
      from,
    });
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
            onPress={() => {
              // 갤러리에서 왔으면 갤러리로, 아니면 카메라로
              if (from === 'gallery') {
                navigation.navigate('Gallery');
              } else {
                navigation.navigate('Camera');
              }
            }}>
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>재료 인식 결과</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 촬영된 이미지 영역 */}
        <View style={styles.imageContainer}>
          {photoPath ? (
            <Image
              source={{
                uri:
                  photoPath.startsWith('file://') ||
                  photoPath.startsWith('content://')
                    ? photoPath
                    : `file://${photoPath}`,
              }}
              style={styles.capturedImage}
            />
          ) : (
            <Camera color="#9CA3AF" size={60} />
          )}
        </View>

        {/* AI 인식 재료 섹션 */}
        <View style={styles.ingredientsSection}>
          <View style={styles.sectionHeader}>
            <Star color="#F59E0B" size={20} fill="#F59E0B" />
            <Text style={styles.sectionTitle}>AI가 인식한 재료</Text>
          </View>

          {/* 재료 카드 목록 */}
          <View style={styles.ingredientsList}>
            {ingredients.map(ingredient => (
              <View key={ingredient.id} style={styles.ingredientCard}>
                <View style={styles.ingredientLeft}>
                  <View style={styles.blueDot} />
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                </View>
                <View style={styles.ingredientRight}>
                  {/* 편집 버튼 */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditIngredient(ingredient)}>
                    <Edit2 color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                  {/* 삭제 버튼 */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteIngredient(ingredient)}>
                    <Minus color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* 재료 추가 버튼 */}
            <LinearGradient
              colors={['#00D3F2', '#2B7FFF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.addIngredientButton}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onPress={handleAddIngredient}>
                <Plus color="#FFFFFF" size={20} />
                <Text style={styles.addButtonText}>재료 추가</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomButtonsContainer}>
          {/* 재촬영 버튼 */}
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <RotateCcw color="#FFFFFF" size={20} />
            <Text style={styles.retakeButtonText}>
              {from === 'gallery' ? '다시 가져오기' : '재촬영'}
            </Text>
          </TouchableOpacity>

          {/* 다음 버튼 */}
          <LinearGradient
            colors={['#00B8DB', '#155DFC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.nextButton}>
            <TouchableOpacity
              style={styles.nextButtonInner}
              onPress={handleNext}>
              <Text style={styles.nextButtonText}>다음</Text>
              <ChevronRight color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* 재료 수정 모달 */}
      <IngredientModal
        visible={editModalVisible}
        type="edit"
        title="재료 수정"
        value={ingredientInput}
        onChangeText={setIngredientInput}
        onCancel={() => {
          setEditModalVisible(false);
          setIngredientInput('');
          setSelectedIngredient(null);
        }}
        onConfirm={confirmEditIngredient}
      />

      {/* 재료 추가 모달 */}
      <IngredientModal
        visible={addModalVisible}
        type="add"
        title="재료 추가"
        value={ingredientInput}
        onChangeText={setIngredientInput}
        onCancel={() => {
          setAddModalVisible(false);
          setIngredientInput('');
        }}
        onConfirm={confirmAddIngredient}
      />

      {/* 재료 삭제 확인 모달 */}
      <IngredientModal
        visible={deleteModalVisible}
        type="delete"
        title="재료 삭제"
        message="정말 이 재료를 삭제하시겠습니까?"
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedIngredient(null);
        }}
        onConfirm={confirmDeleteIngredient}
      />
    </View>
  );
}
