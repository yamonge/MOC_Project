import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 23,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metadataText: {
    color: '#ffffffff',
    fontSize: 13,
  },
  metadataDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  heartButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  ingredientsList: {gap: 12},
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {fontSize: 14, color: '#374151'},
  ingredientAmount: {fontSize: 14, color: '#2563EB', fontWeight: '600'},

  stepsList: {gap: 16},
  stepItem: {flexDirection: 'row', alignItems: 'flex-start'},
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FEE2E2', // 스텝 넘버 배경색 통일
  },
  stepNumberText: {color: '#ffffffff', fontWeight: '700'},
  stepText: {flex: 1, fontSize: 14, color: '#374151', lineHeight: 20},

  // 신고하기 버튼
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 20,
    marginRight: 16,
    marginBottom: 24,
  },
  reportText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
  },

  emptyContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyText: {color: '#6B7280'},
});
