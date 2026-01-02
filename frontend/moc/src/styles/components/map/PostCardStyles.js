import {StyleSheet} from 'react-native';
import {colors} from '../../common';

export default StyleSheet.create({
  // 카드 컨테이너
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },

  // 카드 내부 패딩
  cardContent: {
    padding: 16,
    gap: 12,
  },

  // 상단 헤더 (마트명 + 거리)
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 44.5,
  },

  // 왼쪽 (마트명 + 시간)
  leftSection: {
    flex: 1,
    gap: 4,
  },

  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: 24,
  },

  timeAgo: {
    fontSize: 11,
    color: '#A1A1A1',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 16.5,
  },

  // 오른쪽 (거리)
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  distanceText: {
    fontSize: 12,
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 18,
  },

  // 정보 그리드 (시간, 인원, 구매 항목, 작성자)
  infoGrid: {
    gap: 12,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // 아이콘 박스
  iconBox: {
    width: 28,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 정보 텍스트
  infoTextContainer: {
    flex: 1,
    gap: 0,
  },

  infoLabel: {
    fontSize: 10,
    color: '#A1A1A1',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 15,
  },

  infoValue: {
    fontSize: 13,
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 19.5,
  },

  // 버튼 (상세보기 / 접기)
  toggleButton: {
    backgroundColor: colors.mapIconBlue,
    borderRadius: 12,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  toggleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: 18,
  },

  // 확장된 콘텐츠
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  // 상세 내용 섹션
  detailSection: {
    gap: 12,
  },

  detailLabel: {
    fontSize: 13,
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 19.5,
  },

  detailBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },

  detailText: {
    fontSize: 12,
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: 18,
  },

  // 참여하기 버튼
  joinButton: {
    backgroundColor: colors.mapIconBlue,
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  joinButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: 22.5,
  },

  // 작성자용 버튼 (채팅방 입장)
  ownerButton: {
    backgroundColor: '#10B981', // 초록색
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
