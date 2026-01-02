import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  // ===== 프로필 사진 영역 =====
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  profileImageWrapper: {
    width: 80,
    height: 80,
    marginBottom: 8,
    position: 'relative',
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.cardMedium,
  },

  profileImageLabel: {
    fontSize: 12,
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 입력 폼 =====
  formContainer: {
    gap: 12,
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

  input: {
    height: 43,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    textAlignVertical: 'center', // Android 텍스트 세로 정렬
    includeFontPadding: false,
  },

  // 이메일 입력 (읽기 전용)
  emailInputContainer: {
    position: 'relative',
  },

  emailInput: {
    backgroundColor: colors.gray100,
    color: colors.textGray,
  },

  emailIcon: {
    position: 'absolute',
    right: 12,
    top: 13.5,
  },

  emailHint: {
    fontSize: 11,
    color: '#99a1af',
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 저장 버튼 =====
  buttonContainer: {
    paddingTop: 21,
    paddingBottom: 120,
    backgroundColor: colors.gray50,
  },

  saveButton: {
    height: 46.5,
    borderRadius: 14,
    overflow: 'hidden',
  },

  saveButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'NotoSansKR-Bold',
  },
});

export default styles;
