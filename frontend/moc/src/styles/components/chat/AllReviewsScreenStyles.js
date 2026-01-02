import {StyleSheet} from 'react-native';
import {colors} from '../../common';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.bgWhite,
  },

  // 헤더
  header: {
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingBottom: 1,
    justifyContent: 'center',
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },

  // 평균 평점 섹션
  ratingSection: {
    height: 121,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    background: 'linear-gradient(162deg, #EFF6FF 0%, #FAF5FF 100%)',
    // React Native에서 그라데이션 대체 (라이브러리 필요시 추가)
    backgroundColor: '#F0F4FF',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 1,
  },

  ratingContent: {
    gap: 8,
  },

  ratingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 40,
  },

  ratingNumber: {
    fontSize: 36,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 40,
  },

  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
  },

  totalReviews: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },

  // 후기 목록
  reviewsList: {
    flex: 1,
  },

  reviewsContent: {
    paddingLeft: 20,
    paddingRight: 35,
    paddingVertical: 10,
    gap: 16,
  },

  reviewCard: {
    backgroundColor: colors.bgWhite,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingTop: 17,
    paddingHorizontal: 17,
    paddingBottom: 17,
    gap: 12,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
  },

  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  authorAvatar: {
    overflow: 'hidden',
    width: 32,
    height: 32,
    borderRadius: 16,
    background: 'linear-gradient(135deg, #51A2FF 0%, #AD46FF 100%)',
    // 그라데이션 대체
    backgroundColor: '#7F7FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  authorAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  authorInitial: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: colors.textWhite,
    lineHeight: 20,
  },

  authorName: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
  },

  reviewDate: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999',
    lineHeight: 20,
  },

  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 16,
  },

  reviewContent: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
    lineHeight: 24,
  },

  // 로딩 상태
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#737373',
    includeFontPadding: false,
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },

  emptyText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#9CA3AF',
    includeFontPadding: false,
  },
});

export default styles;
