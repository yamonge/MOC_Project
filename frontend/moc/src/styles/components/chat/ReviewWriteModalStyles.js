import {StyleSheet} from 'react-native';
import {colors} from '../../common';

const styles = StyleSheet.create({
  // 오버레이 (반투명 배경)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    zIndex: 9999,
  },

  // 모달 컨테이너
  modalContainer: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
    marginBottom: 50,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  // 스크롤 콘텐츠 영역
  scrollContent: {
    flexGrow: 1,
  },

  // 콘텐츠 영역
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
  },

  // 프로필 섹션
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },

  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },

  profileEmoji: {
    fontSize: 28,
    includeFontPadding: false,
    color: '#737373',
    fontWeight: 'bold',
  },

  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
    textAlign: 'center',
  },

  profileSubtitle: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // 별점 섹션
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  starButton: {
    padding: 4,
  },

  // 후기 입력 섹션
  reviewInputSection: {
    gap: 12,
  },

  reviewLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  textInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    height: 100,
    textAlignVertical: 'top',
  },

  textInputFocused: {
    borderColor: colors.primary,
  },

  placeholderText: {
    color: 'rgba(23, 23, 23, 0.5)',
  },

  charCount: {
    fontSize: 12,
    color: '#A1A1A1',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    textAlign: 'right',
  },

  // 안내 박스
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BEDBFF',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },

  infoText: {
    fontSize: 12,
    color: '#193CB8',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    lineHeight: 18,
  },

  // 버튼 영역
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },

  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: colors.bgWhite,
    borderWidth: 2,
    borderColor: '#D1D5DC',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#525252',
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  submitButton: {
    backgroundColor: colors.primary,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textWhite,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },
});

export default styles;
