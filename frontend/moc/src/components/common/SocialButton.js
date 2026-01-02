import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  layout,
} from '../../styles/common';
import GoogleLogo from '../../assets/images/user/googleLogo.svg';
import FacebookLogo from '../../assets/images/user/fackbookLogo.svg';

/**
 * 소셜 로그인 버튼 컴포넌트
 *
 * @param {string} provider - 소셜 로그인 제공자 ('google', 'facebook')
 * @param {function} onPress - 버튼 클릭 시 호출되는 함수
 * @param {boolean} disabled - 버튼 비활성화 여부
 */
export default function SocialButton({
  provider,
  onPress,
  disabled = false,
  style,
}) {
  // 제공자별 아이콘 및 스타일
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          icon: GoogleLogo,
          iconSize: layout.iconSizeMedium,
          backgroundColor: colors.bgWhite,
          borderColor: colors.borderGray,
        };
      case 'facebook':
        return {
          icon: FacebookLogo,
          iconSize: 42, // 페이스북은 배경 포함이라 크게
          backgroundColor: 'transparent', // 배경 없음
          borderColor: 'transparent', // 테두리 없음
        };
      default:
        return {
          icon: null,
          iconSize: layout.iconSizeMedium,
          backgroundColor: colors.bgWhite,
          borderColor: colors.borderGray,
        };
    }
  };

  const config = getProviderConfig();
  const IconComponent = config.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        provider === 'facebook' && styles.facebookContainer,
        disabled && styles.disabled,
        style,
      ]}>
      {IconComponent && (
        <IconComponent width={config.iconSize} height={config.iconSize} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.cardSmall,
  },

  facebookContainer: {
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },

  icon: {
    width: layout.iconSizeMedium,
    height: layout.iconSizeMedium,
  },

  disabled: {
    opacity: 0.5,
  },
});
