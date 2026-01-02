import {StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../../common/index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: 136,
    overflow: 'hidden',
  },

  // 배경 장식 아이콘
  decorIcon: {
    position: 'absolute',
  },

  decorIcon1: {
    top: 46,
    left: 291,
    transform: [{rotate: '12deg'}],
  },

  decorIcon2: {
    top: 76,
    left: 269,
    transform: [{rotate: '-6deg'}],
  },

  decorIcon3: {
    top: 94,
    left: -6,
    transform: [{rotate: '45deg'}],
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 15,
    paddingLeft: 5,
  },

  headerName: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...typography.title,
    fontSize: 26,
    color: colors.white,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 23.5,
    flexDirection: 'row',
    width: 'auto',
    gap: 10,
    alignItems: 'center',
    marginLeft: 40,
    marginTop: -20,
  },
  countText: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    width: 30,
    ...typography.button,
    fontSize: 13,
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  cartIcon: {
    marginLeft: 4,
  },
  headerImage: {
    width: 136,
    height: 136,
  },

  // 스크롤 영역
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 140, // 하단 버튼 공간
    gap: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...typography.body,
    color: colors.textGray,
    fontSize: 16,
  },

  // 하단 버튼
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 60,
  },
  aiButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  aiButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  aiButtonText: {
    ...typography.button,
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  addButton: {
    width: 96,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
  },
  addButtonText: {
    ...typography.button,
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },

  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalCancelButton: {
    backgroundColor: colors.bgGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    ...typography.button,
    fontSize: 16,
    color: colors.textDark,
  },
  modalConfirmButton: {
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    ...typography.button,
    fontSize: 16,
    color: colors.white,
  },
});
