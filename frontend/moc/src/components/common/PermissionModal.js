import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Portal} from '@gorhom/portal';
import styles from '../../styles/components/PermissionModalStyles';

const PermissionModal = ({
  visible,
  title = '권한 필요',
  message = '이 기능을 사용하려면 권한이 필요합니다.',
  onCancel,
  onConfirm,
  confirmText = '설정으로 이동',
  cancelText = '취소',
}) => {
  const handleConfirm = () => {
    // 설정 열기
    Linking.openSettings();

    // onConfirm 콜백이 있으면 실행 (모달 닫기 등)
    if (onConfirm) {
      onConfirm();
    }
  };

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#00B8DB', '#0095D5', '#0080CC', '#155DFC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.confirmButton}>
              <TouchableOpacity
                style={styles.confirmButtonInner}
                onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Portal>
  );
};

export default PermissionModal;
