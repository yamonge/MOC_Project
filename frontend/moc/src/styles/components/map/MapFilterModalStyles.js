import {StyleSheet} from 'react-native';
import {colors, spacing, fontSizes} from '../../common';

export default StyleSheet.create({
  // 배경 오버레이
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 모달 컨테이너
  modalContainer: {
    width: 323,
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    padding: 20,
    gap: 23,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },

  // 상단 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
  },

  title: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    lineHeight: 27,
    color: colors.textBlack,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 섹션
  section: {
    gap: 12,
  },

  sectionLabel: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textGray,
  },

  // 장소 유형 칩
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 17,
    paddingVertical: 7.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderGray,
    backgroundColor: colors.bgWhite,
  },

  chipSelected: {
    borderColor: colors.mapIconBlue,
    backgroundColor: colors.mapIconBlue,
  },

  chipText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textBlack,
  },

  chipTextSelected: {
    color: colors.textWhite,
  },

  // 거리 섹션
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  distanceValue: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.mapIconBlue,
  },

  slider: {
    width: '100%',
    height: 6,
  },

  distanceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  distanceRangeText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textLightGray,
  },

  // 적용하기 버튼
  applyButton: {
    height: 48,
    backgroundColor: colors.mapIconBlue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  applyButtonText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.textWhite,
  },
});
