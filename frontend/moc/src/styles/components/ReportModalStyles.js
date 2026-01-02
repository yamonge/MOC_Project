import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 340,
    marginHorizontal: 18,
    height: 700,
  },

  // 헤더
  header: {
    height: 73,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#171717',
    lineHeight: 27,
    includeFontPadding: false,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 콘텐츠
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 35,
    paddingTop: 20,
  },

  // 신고 대상
  targetSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 4,
    marginBottom: 20,
  },

  targetLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#737373',
    lineHeight: 18,
    includeFontPadding: false,
  },

  targetName: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#171717',
    lineHeight: 21,
    includeFontPadding: false,
  },

  // 신고 사유
  reasonSection: {
    gap: 12,
    marginBottom: 20,
  },

  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22.5,
  },

  reasonTitle: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    color: '#171717',
    lineHeight: 22.5,
    includeFontPadding: false,
  },

  required: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FB2C36',
    lineHeight: 22.5,
    marginLeft: 2,
    includeFontPadding: false,
  },

  reasonList: {
    gap: 8,
  },

  reasonButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 44,
    paddingBottom: 2,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },

  reasonButtonSelected: {
    backgroundColor: 'rgba(127, 201, 231, 0.1)',
    borderColor: '#155DFC',
  },

  reasonButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: '#525252',
    lineHeight: 21,
    includeFontPadding: false,
  },

  reasonButtonTextSelected: {
    color: '#155DFC',
  },

  // 상세 내용
  detailSection: {
    gap: 12,
    marginBottom: 20,
  },

  detailTitle: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    color: '#171717',
    lineHeight: 22.5,
    includeFontPadding: false,
  },

  detailInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#171717',
    lineHeight: 21,
    includeFontPadding: false,
  },

  // 경고 문구
  warningBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEE685',
    borderRadius: 12,
    paddingTop: 13,
    paddingBottom: 13,
    paddingHorizontal: 13,
    marginBottom: 20,
  },

  warningText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#973C00',
    lineHeight: 18,
    includeFontPadding: false,
  },

  // 하단 버튼
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 81,
    paddingTop: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },

  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#525252',
    lineHeight: 21,
    includeFontPadding: false,
  },

  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(161deg, #ED6F75 0%, #C80000 100%)',
    // React Native에서 그라데이션 대체
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },

  submitButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    lineHeight: 21,
    includeFontPadding: false,
  },
});

export default styles;
