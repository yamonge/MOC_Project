import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 상단 헤더
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 36,
  },

  // 필터 섹션
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    fontFamily: 'NotoSansKR-Bold',
    marginBottom: 12,
  },

  // 필터 버튼 컨테이너
  filterButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // 필터 버튼 (미선택)
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#525252',
    fontFamily: 'NotoSansKR-Bold',
    textAlign: 'center',
  },

  // 필터 버튼 (선택됨)
  filterButtonSelected: {
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },

  // 하단 다음 버튼 영역
  bottomButtonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
    marginTop: -3,
  },
});
