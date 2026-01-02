import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {Check} from 'lucide-react-native';
import {colors, spacing, borderRadius, typography} from '../../styles/common';

/**
 * 재사용 가능한 Checkbox 컴포넌트
 *
 * @param {boolean} checked - 체크 상태
 * @param {function} onPress - 체크박스 클릭 시 호출되는 함수
 * @param {string} label - 체크박스 라벨 텍스트
 * @param {ReactNode} labelComponent - 커스텀 라벨 컴포넌트 (label 대신 사용)
 * @param {boolean} disabled - 비활성화 여부
 * @param {string} variant - 스타일 변형 ('default', 'gradient')
 * @param {object} style - 추가 스타일
 */
export default function Checkbox({
  checked = false,
  onPress,
  label,
  labelComponent,
  disabled = false,
  variant = 'default',
  style,
}) {
  // Gradient 배경 여부
  const isGradient = variant === 'gradient';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        isGradient && styles.gradientContainer,
        disabled && styles.disabled,
        style,
      ]}>
      {/* 체크박스 */}
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          isGradient && styles.checkboxGradient,
        ]}>
        {checked && (
          <Check
            size={isGradient ? 14 : 12}
            color={colors.textWhite}
            strokeWidth={3}
          />
        )}
      </View>

      {/* 라벨 */}
      {labelComponent ? (
        labelComponent
      ) : label ? (
        <Text style={[styles.label, isGradient && styles.labelGradient]}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  gradientContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: '#EFF6FF', // 그라데이션 배경 (실제로는 LinearGradient 사용 권장)
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxGradient: {
    width: 20,
    height: 20,
  },

  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  label: {
    ...typography.body,
    color: colors.textDark,
    marginLeft: spacing.md,
    flex: 1,
  },

  labelGradient: {
    ...typography.button,
    fontWeight: '700',
  },

  disabled: {
    opacity: 0.5,
  },
});
