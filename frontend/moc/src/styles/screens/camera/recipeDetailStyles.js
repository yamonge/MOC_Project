import {StyleSheet} from 'react-native';
import {colors} from '../../common';

/**
 * 레시피 상세 화면 전용 스타일
 */
export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 상단 그라데이션 헤더
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
    marginLeft: 20,
  },

  headerMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 60,
  },

  metadataText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },

  metadataDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 12,
  },

  // 스크롤 컨텐츠
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 17,
    paddingBottom: 150,
  },

  // 레시피 이미지 (최상단 추가)
  recipeImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  recipeImage: {
    width: '100%',
    height: '100%',
  },

  recipePlaceholderIcon: {
    width: 64,
    height: 64,
  },

  // 카드 공통 스타일
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Noto Sans KR',
  },

  // 필요한 재료 카드
  ingredientsList: {
    gap: 12,
  },

  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ingredientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Noto Sans KR',
  },

  ingredientAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#155DFC',
    fontFamily: 'Noto Sans KR',
  },

  // 조리 순서 카드
  stepsList: {
    gap: 16,
  },

  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },

  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Noto Sans KR',
    paddingTop: 4,
    lineHeight: 22.5,
  },

  // 하단 액션 영역
  actionContainer: {
    paddingTop: 30,
    gap: 16,
    marginBottom: 150,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#155DFC',
    borderColor: '#155DFC',
  },

  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Noto Sans KR',
  },

  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },

  // 저장됨 버튼 스타일
  savedButton: {
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  savedButtonText: {
    color: '#6B7280',
  },

  // 로딩 상태
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Noto Sans KR',
  },

  // 에러 상태
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Noto Sans KR',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0092B8',
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    fontFamily: 'Noto Sans KR',
  },
});

export default styles;
