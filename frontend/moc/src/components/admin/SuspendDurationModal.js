import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {X} from 'lucide-react-native';
import styles from '../../styles/components/admin/SuspendDurationModalStyles';

/**
 * 계정 정지 기간 선택 모달
 *
 * Props:
 * - visible: 모달 표시 여부
 * - userName: 회원 이름
 * - onClose: 모달 닫기 콜백
 * - onSelect: 기간 선택 콜백 (duration: 1, 3, 7, 'permanent')
 */
export default function SuspendDurationModal({
  visible,
  userName,
  onClose,
  onSelect,
}) {
  if (!visible) return null;

  const handleSelect = duration => {
    onSelect(duration);
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalContainer}>
        {/* 헤더 */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>정지 기간 선택</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <X size={24} color="#0a0a0a" />
          </TouchableOpacity>
        </View>

        {/* 기간 선택 버튼 */}
        <View style={styles.buttonContainer}>
          {/* 1일 정지 */}
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => handleSelect(1)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFAB70', '#D35F0E']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              angle={99.76}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>1일 정지</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 3일 정지 */}
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => handleSelect(3)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFAB70', '#D35F0E']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              angle={99.76}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>3일 정지</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 7일 정지 */}
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => handleSelect(7)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFAB70', '#D35F0E']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              angle={99.76}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>7일 정지</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 영구 정지 */}
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => handleSelect('permanent')}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#ED6F75', '#F60000']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              angle={170.24}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>영구 정지</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
