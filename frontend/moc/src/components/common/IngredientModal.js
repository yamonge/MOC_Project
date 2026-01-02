import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../../styles/components/IngredientModalStyles';

/**
 * 재료 관리용 재사용 가능한 모달 컴포넌트
 *
 * @param {boolean} visible - 모달 표시 여부
 * @param {string} type - 모달 타입: 'add' | 'edit' | 'delete'
 * @param {string} title - 모달 타이틀
 * @param {string} value - (add/edit) TextInput 값
 * @param {function} onChangeText - (add/edit) TextInput 변경 핸들러
 * @param {string} message - (delete) 확인 메시지
 * @param {function} onCancel - 취소 버튼 핸들러
 * @param {function} onConfirm - 확인/저장/삭제 버튼 핸들러
 */
export default function IngredientModal({
  visible,
  type = 'add', // 'add' | 'edit' | 'delete'
  title,
  value = '',
  onChangeText,
  message,
  onCancel,
  onConfirm,
}) {
  const showInput = type === 'add' || type === 'edit';
  const showMessage = type === 'delete';

  // 확인 버튼 텍스트
  const getConfirmText = () => {
    switch (type) {
      case 'add':
        return '저장';
      case 'edit':
        return '수정';
      case 'delete':
        return '삭제';
      default:
        return '확인';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onCancel}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}>
        <View style={styles.modalContainer}>
          {/* 타이틀 */}
          <Text style={styles.modalTitle}>{title}</Text>

          {/* TextInput (추가/수정) */}
          {showInput && (
            <TextInput
              style={styles.modalInput}
              value={value}
              onChangeText={onChangeText}
              placeholder="재료명을 입력하세요"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
          )}

          {/* 확인 메시지 (삭제) */}
          {showMessage && <Text style={styles.modalMessage}>{message}</Text>}

          {/* 버튼 영역 */}
          <View style={styles.modalButtons}>
            {/* 취소 버튼 */}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onCancel}>
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>

            {/* 확인 버튼 (타입별 스타일) */}
            {type === 'delete' ? (
              // 삭제 버튼 (빨간색)
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={onConfirm}>
                <Text style={styles.modalDeleteText}>{getConfirmText()}</Text>
              </TouchableOpacity>
            ) : (
              // 저장 버튼 (그라데이션)
              <LinearGradient
                colors={['#00B8DB', '#155DFC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.modalConfirmButton}>
                <TouchableOpacity
                  style={styles.modalConfirmInner}
                  onPress={onConfirm}>
                  <Text style={styles.modalConfirmText}>
                    {getConfirmText()}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
