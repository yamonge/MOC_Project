import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {AlertTriangle} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/components/camera/IngredientConsumeModalStyles';

const IngredientConsumeModal = ({
  visible,
  onClose,
  onConfirm,
  availableIngredients = [],
  missingIngredients = [],
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 스크롤 가능한 컨텐츠 영역 */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}>
            {/* 경고 아이콘 */}
            <View style={styles.iconContainer}>
              <AlertTriangle size={48} color="#00D98F" strokeWidth={2.5} />
            </View>

            {/* 제목 */}
            <Text style={styles.title}>재료가 소비됩니다</Text>

            {/* 설명 */}
            <Text style={styles.description}>
              시작하기 터치시 아래 재료가 소비됩니다.{'\n'}
              부족한 재료가 있습니다. 그래도 하시겠습니까?
            </Text>
            {/* 보유 재료 섹션 */}
            <View style={styles.ingredientSection}>
              <Text style={styles.sectionLabel}>보유 재료</Text>
              <View style={styles.ingredientBox}>
                <View style={styles.ingredientChipsContainer}>
                  {availableIngredients.map((ingredient, index) => (
                    <View key={index} style={styles.availableChip}>
                      <Text style={styles.availableChipText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 부족한 재료 섹션 */}
            <View style={styles.ingredientSection}>
              <Text style={styles.sectionLabel}>부족한 재료</Text>
              <View style={styles.missingBox}>
                <View style={styles.ingredientChipsContainer}>
                  {missingIngredients.map((ingredient, index) => (
                    <View key={index} style={styles.missingChip}>
                      <Text style={styles.missingChipText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 버튼 그룹 */}
            <View style={styles.buttonGroup}>
              {/* 시작하기 버튼 */}
              <TouchableOpacity onPress={onConfirm} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#00B8DB', '#155DFC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>시작하기</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* 취소 버튼 */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default IngredientConsumeModal;
