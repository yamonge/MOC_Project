import {StyleSheet} from 'react-native';
import {colors, typography, spacing, borderRadius, shadows} from '../../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // ===== 헤더 =====
  header: {
    height: 56,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...shadows.cardSmall,
  },

  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  // ===== 스크롤 영역 =====
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 130,
    gap: 24,
  },

  // ===== 앱 아이콘 섹션 =====
  appIconSection: {
    alignItems: 'center',
    gap: 12,
  },

  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  appVersion: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 정보 카드 =====
  infoCards: {
    gap: 10,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    ...shadows.cardSmall,
  },

  infoCardTall: {
    paddingBottom: 14,
  },

  businessCard: {
    gap: 0,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Medium',
    marginBottom: -10,
  },

  infoValue: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },

  businessInfo: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 19.5,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 저작권 섹션 =====
  copyrightSection: {
    alignItems: 'center',
    paddingTop: 12,
    gap: 2,
  },

  copyrightText: {
    fontSize: 12,
    color: '#99a1af',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
  },

  madeWithLove: {
    fontSize: 11,
    color: '#d1d5dc',
    textAlign: 'center',
    lineHeight: 16.5,
    fontFamily: 'NotoSansKR-Regular',
  },
});

export default styles;
