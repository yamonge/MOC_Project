import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // ===== 그라데이션 헤더 =====
  header: {
    height: 134,
    position: 'relative',
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

  // 헤더 내용
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 40,
    gap: 10,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'NotoSansKR-Bold',
  },

  // 일러스트 이미지
  illustration: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 136,
    height: 136,
  },

  // ===== 스크롤 영역 =====
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 130,
    gap: 24,
  },

  // ===== 관리 메뉴 =====
  menuSection: {
    gap: 12,
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...shadows.cardSmall,
  },

  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuInfo: {
    flex: 1,
    gap: 4,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  menuDescription: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 통계 카드 =====
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BEDBFF',
    borderRadius: 14,
    padding: 17,
    gap: 4,
  },

  statCardRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FFC9C9',
  },

  statLabel: {
    fontSize: 12,
    color: '#155DFC',
    fontFamily: 'NotoSansKR-Regular',
  },

  statLabelRed: {
    fontSize: 12,
    color: '#E7000B',
    fontFamily: 'NotoSansKR-Regular',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C398E',
    fontFamily: 'NotoSansKR-Bold',
  },

  statValueRed: {
    fontSize: 24,
    fontWeight: '700',
    color: '#82181A',
    fontFamily: 'NotoSansKR-Bold',
  },
});

export default styles;
