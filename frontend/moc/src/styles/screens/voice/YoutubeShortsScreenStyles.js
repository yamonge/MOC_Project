import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // 상단 결과 영역
  resultArea: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // 배경 움직이는 원들
  overlay01: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252, 206, 232, 0.3)',
    right: 30,
    top: 40,
  },
  overlay02: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    left: 40,
    top: 20,
    opacity: 0.54,
  },

  // 마이크 버튼
  micButtonWrapper: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  micButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 25},
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },
  micImage: {
    width: 100,
    height: 100,
  },

  // 요리명 텍스트
  recipeNameText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 32,
    lineHeight: 40,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  // 쇼츠 리스트 영역
  shortsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // 하단 네비게이션 공간
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    lineHeight: 27,
    color: '#000000',
    includeFontPadding: false,
  },

  // 그리드
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },

  // 쇼츠 아이템
  shortItem: {
    width: (SCREEN_WIDTH - 48) / 2, // 2열 (16px * 3 = 48px 패딩)
    marginBottom: 16,
  },

  // 썸네일
  thumbnail: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // 시간 배지
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 10,
    lineHeight: 15,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  // 제목
  shortTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 13,
    lineHeight: 16.25,
    color: '#000000',
    marginTop: 8,
    includeFontPadding: false,
  },
});
