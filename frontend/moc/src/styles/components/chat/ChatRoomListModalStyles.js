import {StyleSheet} from 'react-native';
import {colors, spacing} from '../../common';

export default StyleSheet.create({
  // 배경 오버레이 (어두운 반투명)
  overlay2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 모달 컨테이너
  modalContainer: {
    width: 330,
    maxHeight: 553,
    borderRadius: 20,
    backgroundColor: colors.backgroundWhite,
  },

  // 헤더
  header: {
    height: 69,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'Noto Sans KR',
    fontWeight: '700',
    color: colors.textBlack,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 채팅방 리스트
  listContainer: {
    maxHeight: 484,
  },

  listContent: {
    paddingBottom: 16,
  },

  // 채팅방 카드
  chatRoomCard: {
    backgroundColor: colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },

  cardContent: {
    gap: 8,
  },

  // 상단 영역 (이름 + 시간 + 배지)
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40.5,
  },

  leftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusDotActive: {
    backgroundColor: '#00C950', // 진행중 (초록)
  },

  storeName: {
    fontSize: 15,
    fontFamily: 'Noto Sans KR',
    fontWeight: '700',
    color: colors.textBlack,
  },

  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },

  timeText: {
    fontSize: 11,
    fontFamily: 'Noto Sans KR',
    fontWeight: '400',
    color: colors.textGray,
  },

  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FB2C36',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 11,
    fontFamily: 'Noto Sans KR',
    fontWeight: '700',
    color: colors.textWhite,
  },

  // 하단 영역 (상태 + 메시지)
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 18,
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'Noto Sans KR',
    fontWeight: '700',
  },

  statusActive: {
    color: '#00A63E', // 진행중
  },

  statusDone: {
    color: colors.primaryBlue, // 완료
  },

  statusCanceled: {
    color: '#E7000B', // 취소됨
  },

  lastMessage: {
    fontSize: 12,
    fontFamily: 'Noto Sans KR',
    fontWeight: '400',
    color: colors.textGray2,
  },

  // 완료/취소 상태 버튼 영역
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 49,
    paddingTop: 13,
  },

  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },

  reviewButton: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEE685',
  },

  reviewButtonText: {
    fontSize: 13,
    fontFamily: 'Noto Sans KR',
    fontWeight: '500',
    color: '#BB4D00',
  },

  deleteButton: {
    backgroundColor: colors.gray50,
    borderColor: colors.gray200,
  },

  deleteButtonText: {
    fontSize: 13,
    fontFamily: 'Noto Sans KR',
    fontWeight: '500',
    color: colors.textDark,
  },

  // Swipe 숨겨진 버튼 (뒤에서 나오는 삭제/후기)
  hiddenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },

  hiddenButton: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteHiddenButton: {
    backgroundColor: '#FB2C36',
  },

  reviewHiddenButton: {
    backgroundColor: '#FEE685',
  },

  hiddenButtonText: {
    fontSize: 13,
    fontFamily: 'Noto Sans KR',
    fontWeight: '700',
    color: colors.textWhite,
  },

  reviewHiddenButtonText: {
    color: '#BB4D00',
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 15,
    fontFamily: 'Noto Sans KR',
    fontWeight: '400',
    color: colors.textGray,
  },

  // 아이콘 체크/X
  iconContainer: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 하단 힌트
  hintContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(21, 93, 252, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(21, 93, 252, 0.1)',
  },

  hintText: {
    fontSize: 12,
    fontFamily: 'Noto Sans KR',
    fontWeight: '400',
    color: colors.textGray,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
