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
    includeFontPadding: false,
  },

  // ===== 검색 및 필터 영역 =====
  searchSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
    ...shadows.cardSmall,
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

  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },

  filterButton: {
    height: 35.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#155dfc',
  },

  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4a5565',
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },

  filterButtonTextActive: {
    color: colors.white,
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

  // ===== 게시글 카드 =====
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
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

  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
    flex: 1,
  },

  statusBadge: {
    height: 20.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadgePublic: {
    backgroundColor: '#dcfce7',
  },

  statusBadgeHidden: {
    backgroundColor: '#f3f4f6',
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },

  statusBadgeTextPublic: {
    color: '#008236',
  },

  statusBadgeTextHidden: {
    color: '#364153',
  },

  // 카드 정보
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  ownerText: {
    fontSize: 13,
    color: '#4a5565',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  dateText: {
    fontSize: 13,
    color: '#99a1af',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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
