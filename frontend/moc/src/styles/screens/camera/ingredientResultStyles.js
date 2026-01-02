import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
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

  // 촬영된 이미지 영역
  imageContainer: {
    marginHorizontal: 24,
    marginTop: 9, // 134 + 9 = 143 (top position)
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraIconPlaceholder: {
    width: 60,
    height: 60,
  },

  // AI 인식 재료 섹션
  ingredientsSection: {
    marginHorizontal: 24,
    marginTop: 11, // 343 + 11 = 354
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'NotoSansKR-Bold',
  },

  // 재료 카드 목록
  ingredientsList: {
    gap: 12,
  },

  // 재료 카드
  ingredientCard: {
    backgroundColor: '#FFFFFF',
    height: 66,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  blueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0EA5E9',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'NotoSansKR-Medium',
  },
  ingredientRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // 편집/삭제 버튼
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  editButton: {
    backgroundColor: '#0EA5E9',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },

  // 재료 추가 버튼
  addIngredientButton: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
  },

  // 하단 고정 버튼 영역
  bottomButtonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 60,
    gap: 12,
  },

  // 재촬영 버튼
  retakeButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
  },

  // 다음 버튼
  nextButton: {
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
    textAlign: 'center',
    marginTop: -3,
  },
});
