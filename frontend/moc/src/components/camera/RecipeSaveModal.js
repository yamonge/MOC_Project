import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {Check} from 'lucide-react-native';
import styles from '../../styles/components/camera/RecipeSaveModalStyles';

const RecipeSaveModal = ({
  visible,
  onClose,
  onNavigateToRecipe,
  recipeName = '소고기 덮밥',
  hideStartButton = false, // 레시피->직접입력일 때 시작 버튼 숨김
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 체크 아이콘 */}
          <View style={styles.iconContainer}>
            <Check size={48} color="#00D98F" strokeWidth={3} />
          </View>

          {/* 제목 */}
          <Text style={styles.title}>레시피가 저장되었습니다!</Text>

          {/* 설명 */}
          <Text style={styles.description}>
            {recipeName} 레시피를 성공적으로 저장했습니다.
          </Text>

          {/* 버튼 그룹 */}
          <View style={styles.buttonGroup}>
            {/* 바로 시작하러 가기 버튼 (레시피->직접입력일 때 숨김) */}
            {!hideStartButton && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onNavigateToRecipe}
                activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>바로 시작하러 가기</Text>
              </TouchableOpacity>
            )}

            {/* 더 둘러보기 버튼 */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>더 둘러보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecipeSaveModal;
