import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // ===== 헤더 =====
  header: {
    height: 56,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...shadows.cardSmall,
  },

  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  // ===== 스크롤 영역 =====
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // ===== 입력 폼 =====
  formContainer: {
    gap: 12,
    marginBottom: 24,
  },

  inputGroup: {
    gap: 6,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#364153',
    fontFamily: 'NotoSansKR-Medium',
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 43,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    position: 'relative',
  },

  inputIcon: {
    marginRight: 12,
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    paddingVertical: 0,
    lineHeight: 19,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },

  inputHint: {
    fontSize: 11,
    color: '#99a1af',
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 안내 박스 =====
  guideBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },

  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C398E',
    fontFamily: 'NotoSansKR-Bold',
  },

  guideList: {
    gap: 2,
  },

  guideItem: {
    fontSize: 12,
    color: '#1447E6',
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 변경 버튼 =====
  buttonContainer: {
    paddingTop: 21,
    paddingBottom: 20,
    backgroundColor: colors.gray50,
  },

  changeButton: {
    height: 46.5,
    borderRadius: 14,
    overflow: 'hidden',
  },

  changeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },

  changeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'NotoSansKR-Bold',
  },
});

export default styles;
