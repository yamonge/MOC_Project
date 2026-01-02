import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronLeft,
  ShoppingCart,
  Plus,
  Sparkles,
  Star,
} from 'lucide-react-native';
import IngredientCard from '../../components/mypage/IngredientCard';
import styles from '../../styles/screens/mypage/IngredientManagementScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getIngredients,
  addIngredient,
  deleteIngredient,
} from '../../api/mypage';

/**
 * 재료 관리 화면
 *
 * 기능:
 * - 저장된 재료 목록 표시
 * - 재료 삭제
 * - 재료 추가
 * - AI 레시피 추천
 */
export default function IngredientManagementScreen({navigation}) {
  const [ingredients, setIngredients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [loading, setLoading] = useState(false);

  // 재료 목록 불러오기 (화면 포커스마다)
  useFocusEffect(
    React.useCallback(() => {
      loadIngredients();
    }, []),
  );

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('userId 없음');
      }
      const data = await getIngredients(userId);
      setIngredients(data?.userIngredients ?? []);
      console.log('재료 목록 불러오기 (API 주석 처리됨)');
    } catch (error) {
      Alert.alert('오류', '재료 목록을 불러오는데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 재료 삭제
  const handleDelete = async userIngredientId => {
    if (!userIngredientId) {
      console.error('❌ 삭제 ID 없음');
      return;
    }

    Alert.alert('재료 삭제', '정말 이 재료를 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const userId = await AsyncStorage.getItem('userId'); // ❌ 제거 가능하면 제거
            // ⬇️ 이미 Context나 props에 userId 있으면 그걸 쓰면 됨
            await deleteIngredient(userId, userIngredientId);

            setIngredients(prev =>
              prev.filter(item => item.userIngredientId !== userIngredientId),
            );
          } catch (e) {
            console.error(e);
            Alert.alert('오류', '재료 삭제 실패');
          }
        },
      },
    ]);
  };

  // 재료 추가
  const handleAdd = async () => {
    if (!newIngredientName.trim()) {
      Alert.alert('알림', '재료 이름을 입력해주세요.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('userId 없음');

      await addIngredient(userId, newIngredientName.trim(), 'MEAT');

      setNewIngredientName('');
      setShowAddModal(false);

      await loadIngredients();
    } catch (error) {
      Alert.alert('오류', '재료 추가에 실패했습니다.');
      console.error(error);
    }
  };
  // AI 레시피 추천
  const handleAIRecommend = () => {
    // 이동: RecipeFilterScreen으로 연결
    navigation.navigate('RecipeFilter');
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <LinearGradient
        colors={['#00c950', '#009966']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        {/* 배경 장식 아이콘들 */}
        <View style={[styles.decorIcon, styles.decorIcon1]}>
          <ShoppingCart
            size={48}
            color="rgba(255, 255, 255, 0.3)"
            strokeWidth={2}
          />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon2]}>
          <Star size={28} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon3]}>
          <Plus size={42} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>

        <View style={styles.headerLeft}>
          <View style={styles.headerName}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>재료 관리</Text>
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{ingredients.length}개</Text>
            <ShoppingCart color="#fff" size={16} style={styles.cartIcon} />
          </View>
        </View>

        <Image
          source={require('../../assets/images/mypage/list-photoroom.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* 재료 리스트 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {ingredients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 재료가 없습니다</Text>
          </View>
        ) : (
          ingredients.map(item => (
            <IngredientCard
              key={item.userIngredientId}
              name={item.ingredientName}
              category={item.categoryCd}
              icon={item.icon}
              onDelete={() => handleDelete(item.userIngredientId)}
            />
          ))
        )}

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleAIRecommend}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#c27aff', '#f6339a']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              angle={167.44}
              style={styles.aiButtonGradient}>
              <Sparkles color="#fff" size={20} />
              <Text style={styles.aiButtonText}>AI 레시피 추천받기</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#00b8db', '#155dfc']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.addButtonGradient}>
              <Plus color="#fff" size={24} />
              <Text style={styles.addButtonText}>추가</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* 재료 추가 모달 */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>재료 추가</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="재료 이름을 입력하세요"
              value={newIngredientName}
              onChangeText={setNewIngredientName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewIngredientName('');
                }}>
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleAdd}>
                <LinearGradient
                  colors={['#00b8db', '#155dfc']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.modalConfirmGradient}>
                  <Text style={styles.modalConfirmText}>저장</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
