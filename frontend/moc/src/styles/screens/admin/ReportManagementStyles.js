import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // ===== 헤더 =====
  header: {
    height: 72,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
    ...shadows.cardSmall,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  // ===== 검색 및 필터 영역 =====
  searchSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  searchBar: {
    height: 46,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },

  searchIcon: {
    marginRight: 4,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
    padding: 0,
  },

  // 필터 드롭다운
  filterDropdownRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    zIndex: 1000,
  },

  // 커스텀 드롭다운
  dropdownWrapper: {
    flex: 1,
    position: 'relative',
  },

  dropdownButton: {
    height: 40,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  dropdownButtonText: {
    fontSize: 13,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
    flex: 1,
  },

  dropdownPlaceholder: {
    color: '#9ca3af',
  },

  dropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...shadows.cardSmall,
    zIndex: 1001,
    maxHeight: 200,
    width: 110,
  },

  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  dropdownItemActive: {
    backgroundColor: '#f0f9ff',
  },

  dropdownItemText: {
    fontSize: 13,
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  dropdownItemTextActive: {
    color: '#155dfc',
    fontWeight: '600',
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  // ===== 스크롤 뷰 =====
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },

  // ===== 신고 카드 =====
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    ...shadows.cardSmall,
  },

  // 카드 헤더
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },

  badge: {
    height: 24.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },

  dateText: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  // 카드 콘텐츠
  cardContent: {
    gap: 8,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  labelText: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  reporterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },

  arrowText: {
    fontSize: 16,
    color: '#99a1af',
    fontFamily: 'Arial',
    includeFontPadding: false,
  },

  reportedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e7000b',
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  descriptionText: {
    fontSize: 13,
    color: '#364153',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  // 액션 버튼
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    flex: 1,
    height: 35.5,
    borderRadius: 10,
    overflow: 'hidden',
  },

  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.white,
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // ===== 로딩 & 빈 상태 =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },
});

export default styles;
