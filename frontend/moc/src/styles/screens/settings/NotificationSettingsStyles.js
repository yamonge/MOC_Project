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
    padding: 20,
    gap: 20,
  },

  // ===== 알림 권한 상태 카드 =====
  statusCard: {
    borderWidth: 1,
    borderColor: '#FCCEE8',
    borderRadius: 16,
    padding: 17,
    gap: 12,
  },

  statusCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusInfo: {
    flex: 1,
    gap: 0,
    paddingTop: 10,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansKR-Medium',
  },

  statusDescription: {
    fontSize: 12,
    color: '#364153',
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
    paddingLeft: 5,
  },

  // ===== 사용 목적 카드 =====
  purposeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    ...shadows.cardSmall,
  },

  purposeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  purposeList: {
    gap: 8,
  },

  purposeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  purposeNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  purposeNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'NotoSansKR-Bold',
  },

  purposeText: {
    fontSize: 13,
    color: '#364153',
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 권한 설정 안내 박스 =====
  guideBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BEDBFF',
    borderRadius: 16,
    padding: 13,
    gap: 6,
  },

  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C398E',
    fontFamily: 'NotoSansKR-Bold',
  },

  guideList: {
    gap: 2,
  },

  guideItem: {
    fontSize: 12,
    color: '#1447E6',
    lineHeight: 18,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 권한 허용하기 버튼 =====
  permissionButton: {
    height: 46.5,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
  },

  permissionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },

  permissionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'NotoSansKR-Bold',
  },
});

export default styles;
