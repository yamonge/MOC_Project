import {StyleSheet} from 'react-native';
import {colors, spacing} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 지도
  map: {
    flex: 1,
  },

  // 검색바 컨테이너
  searchContainer: {
    position: 'absolute',
    top: 43,
    left: 26,
    right: 26,
    zIndex: 1,
  },

  // 검색바
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.mapSearchBorder,
    paddingHorizontal: 18,
    paddingVertical: 6,
    minHeight: 52,
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // 그림자 (Android)
    elevation: 3,
  },

  // 검색 입력
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: colors.textDark,
    paddingVertical: 8, // 터치 영역 확보
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 커스텀 현재 위치 버튼
  myLocationButton: {
    position: 'absolute',
    left: 20,
    bottom: 140, // 네비게이션 바 위
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.mapSearchBorder,
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // 그림자 (Android)
    elevation: 6,
    zIndex: 10,
  },

  // 위치 추적 활성화 상태
  myLocationButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
    borderWidth: 2,
  },

  // 채팅방 FAB 버튼
  chatFab: {
    position: 'absolute',
    right: 20,
    bottom: 100, // 네비게이션 바 위
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6', // 보라색
    alignItems: 'center',
    justifyContent: 'center',
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // 그림자 (Android)
    elevation: 8,
    zIndex: 10,
  },

  // 배지 (미읽은 메시지)
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.mapBadgeRed,
    borderWidth: 2,
    borderColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 배지 텍스트
  badgeText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Bold',
    color: colors.textWhite,
  },
});

export default styles;
