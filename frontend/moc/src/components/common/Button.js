import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
  layout,
  opacity,
} from '../../styles/common';

/**
 * 재사용 가능한 Button 컴포넌트
 *
 * @param {string} title - 버튼 텍스트
 * @param {function} onPress - 버튼 클릭 시 호출되는 함수
 * @param {string} variant - 버튼 스타일 ('gradient', 'outline', 'text')
 * @param {string} size - 버튼 크기 ('small', 'medium', 'large')
 * @param {boolean} disabled - 버튼 비활성화 여부
 * @param {boolean} loading - 로딩 상태 (로딩 스피너 표시)
 * @param {ReactNode} leftIcon - 좌측 아이콘
 * @param {ReactNode} rightIcon - 우측 아이콘
 */
export default function Button({
  title,
  onPress,
  variant = 'gradient',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) {
  // 버튼 높이 결정
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return layout.buttonHeightSmall;
      case 'large':
        return layout.buttonHeightLarge;
      default:
        return layout.buttonHeight;
    }
  };

  // Gradient 버튼
  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.container, style]}
        {...props}>
        <LinearGradient
          colors={
            disabled ? [colors.borderGray, colors.borderGray] : gradients.button
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            styles.gradientButton,
            {height: getButtonHeight()},
            disabled && styles.disabled,
          ]}>
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text style={[styles.gradientButtonText, textStyle]}>
                {title}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Outline 버튼
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[
          styles.container,
          styles.outlineButton,
          {height: getButtonHeight()},
          disabled && styles.disabled,
          style,
        ]}
        {...props}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={[styles.outlineButtonText, textStyle]}>{title}</Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Text 버튼
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.container,
        styles.textButton,
        disabled && styles.disabled,
        style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.textButtonText, textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Gradient 버튼
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.button,
  },

  gradientButtonText: {
    ...typography.button,
    color: colors.textWhite,
  },

  // Outline 버튼
  outlineButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bgWhite,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },

  outlineButtonText: {
    ...typography.button,
    color: colors.textDark,
  },

  // Text 버튼
  textButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  textButtonText: {
    ...typography.button,
    color: colors.primary,
  },

  // 아이콘
  iconLeft: {
    marginRight: spacing.sm,
  },

  iconRight: {
    marginLeft: spacing.sm,
  },

  // 비활성화
  disabled: {
    opacity: opacity.disabled,
  },
});
