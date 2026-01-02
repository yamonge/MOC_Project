import {StyleSheet} from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
} from '../../common';

/**
 * 로그인 화면 전용 스타일
 */
export const loginStyles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 스크롤 컨테이너
  scrollContainer: {
    flexGrow: 1,
  },

  // 컨텐츠 영역
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // 상단 일러스트 영역
  illustrationContainer: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },

  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // 타이틀 영역
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },

  // Input 영역
  inputContainer: {
    marginBottom: 12,
  },

  // 계정 찾기 링크
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },

  forgotPasswordText: {
    ...typography.caption,
    color: colors.linkBlue,
  },

  // 로그인 버튼
  loginButtonContainer: {
    marginBottom: 24,
  },

  // 구분선
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 24,
  },

  // 소셜 로그인 영역
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },

  // 회원가입 링크
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },

  signupText: {
    ...typography.caption,
    color: colors.textDark,
    opacity: 0.8,
  },

  signupLink: {
    ...typography.caption,
    color: colors.textDark,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },

  // 로딩 오버레이
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  // 에러 메시지
  errorContainer: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },

  errorText: {
    ...typography.body,
    color: colors.textWhite,
    textAlign: 'center',
  },
});

export default loginStyles;
