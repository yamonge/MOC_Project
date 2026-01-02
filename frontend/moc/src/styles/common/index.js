// 공통 스타일 변수
// 모든 화면에서 재사용 가능한 색상, 폰트, 간격 등을 정의

// 색상
export const colors = {
  // Primary
  primary: '#155DFC',
  primaryLight: '#4A7FFF',
  primaryDark: '#0D42C4',

  // Secondary
  secondary: '#00B8DB',
  secondaryLight: '#33C9E6',

  // Text
  textDark: '#36454F',
  textLight: '#C6CEDD',
  textGray: '#737373', // ← 추가!
  textLightGray: '#A1A1A1',
  textDarkGray: '#525252',
  textWhite: '#FFFFFF',
  textBlack: '#000000',

  // Background
  bgWhite: '#FFFFFF',
  bgGray: '#F5F5F5',

  // Border
  borderGray: '#D9D9D9',
  borderLight: '#E5E5E5',

  // Link
  linkBlue: '#5B67CA',

  // Status
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',

  // Map (지도 화면 전용)
  mapSearchBorder: '#D2D6DB',
  mapPlaceholder: '#9DA4AE',
  mapBadgeRed: '#FB2C36',
  mapIconBlue: '#155DFC',

  // Opacity
  blackOverlay: 'rgba(0, 0, 0, 0.5)',
  whiteOverlay: 'rgba(255, 255, 255, 0.8)',

  //White
  white: '#ffffff',
  backgroundWhite: '#ffffff',

  //gray
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',

  // Primary colors
  primaryBlue: '#155DFC',

  // Text colors (additional)
  textGray2: '#525252',
};

// 폰트 (Typography)
export const typography = {
  // 타이틀
  title: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },

  // 서브 타이틀
  subtitle: {
    fontFamily: 'NotoSansKR-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },

  // 본문
  body: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },

  // 버튼
  button: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },

  // 캡션 (작은 텍스트)
  caption: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },

  // 작은 캡션
  small: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
  },
};

// 간격 (Spacing)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // 특수 간격
  horizontalPadding: 51,
  screenPadding: 20,
  inputGap: 36,
  cardGap: 16,
};

// 라운드 (Border Radius)
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  xxl: 24,
  round: 999, // 완전 둥글게
};

// 그림자 (Shadow)
export const shadows = {
  // 버튼 그림자
  button: {
    shadowColor: '#F1F7FF',
    shadowOffset: {width: -3, height: 7},
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 5, // Android
  },

  // 카드 그림자 (작은)
  cardSmall: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // 카드 그림자 (중간)
  cardMedium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // 카드 그림자 (큰)
  cardLarge: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  // 그림자 없음
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// 그라데이션 (Gradient)
export const gradients = {
  // Primary 그라데이션 (좌→우)
  primary: ['#00B8DB', '#155DFC'],

  // Primary 그라데이션 (상→하)
  primaryVertical: ['#155DFC', '#00B8DB'],

  // 버튼 그라데이션
  button: ['#00B8DB', '#155DFC'],

  // 배경 그라데이션 (은은한)
  backgroundLight: ['#F0F8FF', '#FFFFFF'],
};

// 애니메이션 (Animation)
export const animations = {
  // 지속 시간
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Easing
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// 레이아웃 (Layout)
export const layout = {
  // 화면 최대 너비
  maxWidth: 768,

  // 입력 필드 높이
  inputHeight: 50,

  // 버튼 높이
  buttonHeight: 46,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,

  // 아이콘 크기
  iconSizeSmall: 16,
  iconSizeMedium: 24,
  iconSizeLarge: 32,

  // 헤더 높이
  headerHeight: 60,

  // 네비게이션 높이
  navigationHeight: 70,
};

// 투명도 (Opacity)
export const opacity = {
  disabled: 0.5,
  overlay: 0.7,
  hint: 0.6,
  subtle: 0.8,
};
