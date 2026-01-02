import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 26) / 3; // 화면 너비 - 좌우 패딩 - 간격 / 3개

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // 어두운 배경
  },

  // 상단 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 98,
    paddingHorizontal: 24,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    height: 37,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },

  title: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 21,
  },

  headerSpacer: {
    width: 48,
  },

  // 그리드
  gridContainer: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#475569',
  },

  photoItemSelected: {
    borderWidth: 3,
    borderColor: '#00B8DB',
  },

  photoImage: {
    width: '100%',
    height: '100%',
  },

  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(71, 85, 105, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 로딩
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },

  loadingText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: '#9CA3AF',
  },

  // 하단 버튼
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 20,
  },

  uploadButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },

  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 24,
    includeFontPadding: false,
  },

  // 재료 인식 로딩 오버레이
  recognizingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  recognizingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  recognizingSubText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },
});

export default styles;
