import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardAvoid: {
    flex: 1,
  },

  // 상단 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 24,
    gap: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 36,
  },

  // 안내 문구
  subtitle: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 19.5,
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
  },

  // 컨텐츠 영역
  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 200,
  },

  // 재료 입력 카드
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 22,
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },

  // 입력 필드 행
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  textInput: {
    flex: 1,
    height: 46,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    color: '#111827',
    textAlignVertical: 'center',
    includeFontPadding: false,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // 재료 칩 목록
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    minHeight: 48,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#CEFAFE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  chipText: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    color: '#007595',
    lineHeight: 19.5,
  },

  chipRemoveButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A2F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 하단 버튼 영역
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 120, // 네비게이션 바(107px) + 여유 공간
    alignItems: 'center',
    pointerEvents: 'box-none',
  },

  nextButton: {
    width: width - 48,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#00B8DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 15,
    pointerEvents: 'auto',
  },

  nextButtonDisabled: {
    opacity: 0.5,
  },

  nextButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 24,
  },
});

export default styles;
