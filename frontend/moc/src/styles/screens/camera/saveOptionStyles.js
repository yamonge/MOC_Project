import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 상단 헤더 (그라데이션)
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
  },
  headerSpacer: {
    width: 40,
  },

  // 콘텐츠 영역
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 46, // 180 - 134 = 46
  },

  // 인식 완료 카드
  completionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    fontFamily: 'NotoSansKR-Bold',
  },
  completionText: {
    fontSize: 14,
    color: '#525252',
    fontFamily: 'NotoSansKR-Medium',
  },
  completionCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009966',
    fontFamily: 'NotoSansKR-Bold',
  },

  // 옵션 버튼 컨테이너
  optionsContainer: {
    gap: 16,
  },

  // 옵션 버튼
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },

  // 아이콘 컨테이너
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  // 옵션 텍스트 영역
  optionTextContainer: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171717',
    fontFamily: 'NotoSansKR-Bold',
  },
  optionDescription: {
    fontSize: 12,
    color: '#525252',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 19.5,
  },

  // 화살표 아이콘
  arrowIcon: {
    width: 24,
    height: 24,
  },
});
