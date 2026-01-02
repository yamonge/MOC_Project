import {StyleSheet} from 'react-native';
import {colors} from '../../common';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },

  // 헤더
  header: {
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 콘텐츠
  content: {
    flex: 1,
  },

  // 프로필 섹션
  profileSection: {
    paddingTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },

  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    background: 'linear-gradient(135deg, #51A2FF 0%, #AD46FF 100%)',
    alignItems: 'center',
    justifyContent: 'center',
    // iOS 그라데이션 대체 (그라데이션 라이브러리 필요 시 추가)
    backgroundColor: '#7F7FFF',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },

  avatarText: {
    fontSize: 30,
    lineHeight: 36,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  nickname: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
  },

  joinDate: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999',
    lineHeight: 20,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 24,
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
    lineHeight: 24,
  },

  // 통계 섹션
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    height: 92,
    paddingTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  statValue: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999',
    lineHeight: 16,
  },

  // 후기 섹션
  reviewsSection: {
    marginTop: 12,
    paddingHorizontal: 20,
  },

  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    marginBottom: 12,
  },

  reviewsTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
  },

  viewAllButton: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#2B7FFF',
    lineHeight: 20,
  },

  reviewsList: {
    gap: 12,
  },

  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
  },

  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  reviewAuthorName: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: 24,
  },

  reviewStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  reviewDate: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999',
    lineHeight: 20,
  },

  reviewContent: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666',
    lineHeight: 20,
  },
});

export default styles;
