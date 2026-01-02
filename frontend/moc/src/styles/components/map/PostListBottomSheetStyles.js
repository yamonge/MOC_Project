import {StyleSheet} from 'react-native';
import {colors} from '../../common';

export default StyleSheet.create({
  // 바텀시트 컨테이너
  bottomSheetContainer: {
    zIndex: 1,
    elevation: 3,
  },

  // 바텀시트 배경
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // 드래그 핸들 인디케이터
  handleIndicator: {
    backgroundColor: '#D1D5DC',
    width: 40,
    height: 4,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 44,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textBlack,
    fontFamily: 'NotoSansKR-Bold',
  },

  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 필터/글쓰기 영역
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 63,
  },

  // 필터 버튼
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 36,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 30,
    backgroundColor: colors.white,
  },

  filterText: {
    fontSize: 14,
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 글쓰기 버튼
  writeButton: {
    flex: 1,
    height: 39,
    backgroundColor: colors.mapIconBlue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  writeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'NotoSansKR-Bold',
  },

  // 게시물 리스트
  postListContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 150, // 네비게이션 바 높이 + 여유 공간
  },

  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textGray,
    fontFamily: 'NotoSansKR-Regular',
    marginTop: 12,
  },
});
