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
    ...shadows.cardSmall,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  // ===== 스크롤 영역 =====
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },

  // ===== 컨텐츠 카드 =====
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 24,
    ...shadows.cardSmall,
  },

  // ===== 업데이트 정보 =====
  updateInfo: {
    gap: 8,
  },

  updateDate: {
    fontSize: 13,
    color: '#6a7282',
    fontFamily: 'NotoSansKR-Regular',
  },

  introText: {
    fontSize: 14,
    color: '#364153',
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 섹션 =====
  sections: {
    gap: 35,
  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: 'NotoSansKR-Bold',
  },

  sectionContent: {
    gap: 10,
  },

  // ===== 서브섹션 =====
  subsection: {
    paddingLeft: 16,
    gap: 8,
  },

  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e2939',
    fontFamily: 'NotoSansKR-Medium',
  },

  // ===== 텍스트 =====
  bodyText: {
    fontSize: 14,
    color: '#364153',
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },

  listItem: {
    fontSize: 14,
    color: '#364153',
    lineHeight: 21,
    fontFamily: 'NotoSansKR-Regular',
  },

  // ===== 안내 박스 =====
  noticeBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BEDBFF',
    borderRadius: 14,
    padding: 17,
  },

  noticeText: {
    fontSize: 13,
    color: '#1447E6',
    lineHeight: 19.5,
    fontFamily: 'NotoSansKR-Regular',
  },
});

export default styles;
