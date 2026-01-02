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
    gap: 12,
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
    backgroundColor: '#2b7fff',
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

  // ===== 회원 목록 =====
  listContainer: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
  },

  selectAllHeader: {
    height: 46,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...shadows.cardSmall,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#364153',
    fontFamily: 'NotoSansKR-Medium',
  },

  userList: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...shadows.cardSmall,
    marginBottom: 10,
  },

  userListContent: {
    paddingBottom: 120,
  },

  // ===== 회원 카드 =====
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  checkboxContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInfo: {
    flex: 1,
    gap: 4,
  },

  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },

  userNickname: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },

  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  userJoinDate: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
  },

  userReportCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fb2c36',
    fontFamily: 'NotoSansKR-Medium',
  },

  // ===== 상태 배지 =====
  statusBadge: {
    height: 25,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadgeActive: {
    backgroundColor: '#dcfce7',
  },

  statusBadgeSuspended: {
    backgroundColor: '#ffe2e2',
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },

  statusBadgeTextActive: {
    color: '#008236',
  },

  statusBadgeTextSuspended: {
    color: '#c10007',
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
  },
});

export default styles;
