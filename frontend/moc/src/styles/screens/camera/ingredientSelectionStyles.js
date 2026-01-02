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
    paddingTop: 43,
  },
  description: {
    fontSize: 14,
    color: '#525252',
    fontFamily: 'NotoSansKR-Medium',
    marginBottom: 16,
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'NotoSansKR-Medium',
    textAlign: 'center',
    lineHeight: 24,
  },

  // 재료 카드
  ingredientCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ingredientCardSelected: {
    borderWidth: 2,
    borderColor: '#00D492',
  },

  // 재료 헤더
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    borderWidth: 2,
    borderColor: '#D4D4D4',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    borderWidth: 0,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171717',
    fontFamily: 'NotoSansKR-Bold',
  },

  // 사용량 선택 영역
  selectionArea: {
    marginTop: 12,
    gap: 8,
  },
  usageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // 버튼
  optionButton: {
    flex: 1,
    height: 41,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonUnselected: {
    backgroundColor: '#F5F5F5',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-Bold',
    textAlign: 'center',
  },
  optionButtonTextUnselected: {
    color: '#A1A1A1',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },

  // 하단 버튼
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
    backgroundColor: 'transparent',
  },
  recommendButton: {
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
  recommendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
  },
});
