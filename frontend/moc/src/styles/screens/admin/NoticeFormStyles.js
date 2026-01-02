import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius} from '../../common';

const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textDark,
  },

  // 스크롤 영역
  scrollView: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100, // 하단 버튼 공간 확보
    gap: 30,
  },

  // 입력 그룹
  inputGroup: {
    gap: spacing.sm,
  },

  label: {
    ...typography.body,
    fontSize: 14,
    color: colors.textDarkGray,
  },

  // 제목 입력
  titleInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    height: 46,
    ...typography.body,
    fontSize: 14,
    color: colors.textDark,
    includeFontPadding: false,
  },

  // 내용 입력 (멀티라인)
  contentInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    height: 226,
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textDark,
    includeFontPadding: false,
  },

  // 이미지 업로드 박스
  imageUploadBox: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#D1D5DC',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  uploadText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textGray,
  },

  uploadSubText: {
    ...typography.caption,
    fontSize: 12,
    color: '#99A1AF',
  },

  // 업로드된 이미지
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },

  // 하단 버튼 영역
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
  },

  // 취소 버튼
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.gray100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    ...typography.body,
    fontSize: 16,
    color: colors.textDarkGray,
  },

  // 작성/수정 완료 버튼
  submitButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonText: {
    ...typography.body,
    fontSize: 16,
    color: colors.white,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },
});

export default styles;
