import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
} from '../../styles/common';

/**
 * 재사용 가능한 Input 컴포넌트
 *
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} value - input 값
 * @param {function} onChangeText - 값 변경 시 호출되는 함수
 * @param {boolean} secureTextEntry - 비밀번호 입력 여부
 * @param {string} keyboardType - 키보드 타입 ('default', 'email-address', 'numeric' 등)
 * @param {ReactNode} leftIcon - 좌측 아이콘 컴포넌트
 * @param {ReactNode} rightIcon - 우측 아이콘 컴포넌트
 * @param {string} error - 에러 메시지
 * @param {boolean} editable - 입력 가능 여부
 * @param {function} onRightIconPress - 우측 아이콘 클릭 시 호출되는 함수
 */
export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  error,
  editable = true,
  onRightIconPress,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Input 영역 */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}>
        {/* 좌측 아이콘 */}
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        {/* 텍스트 입력 필드 */}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...props}
        />

        {/* 우측 아이콘 (터치 가능) */}
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* 하단 구분선 */}
      <View
        style={[
          styles.borderLine,
          isFocused && styles.borderLineFocused,
          error && styles.borderLineError,
        ]}
      />

      {/* 에러 메시지 */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    paddingHorizontal: spacing.sm,
  },

  inputWrapperFocused: {
    // 포커스 시 스타일 (선택사항)
  },

  inputWrapperError: {
    // 에러 시 스타일 (선택사항)
  },

  input: {
    flex: 1,
    height: '100%',
    ...typography.body,
    color: colors.textDark,
    paddingVertical: 0, // Android 기본 padding 제거
  },

  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },

  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },

  leftIconContainer: {
    width: layout.iconSizeMedium,
    height: layout.iconSizeMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  rightIconContainer: {
    width: layout.iconSizeMedium,
    height: layout.iconSizeMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },

  // 하단 구분선
  borderLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderGray,
  },

  borderLineFocused: {
    backgroundColor: colors.primary,
    height: 2,
  },

  borderLineError: {
    backgroundColor: colors.error,
    height: 2,
  },

  // 에러 메시지
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
