import {StyleSheet, Dimensions} from 'react-native';
import {colors, spacing, typography} from '../../common';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: 24,
  },

  // 상단 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 42,
  },

  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 안내 문구
  subtitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 21,
    marginBottom: 24,
  },

  // 카드 컨테이너
  cardsContainer: {
    gap: 20,
  },

  // 큰 카드 (직접 입력)
  cardLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
    minHeight: 149,
  },

  // 일반 카드 (내 재료)
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
    minHeight: 122,
  },

  // 아이콘 컨테이너
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  iconBlue: {
    backgroundColor: '#3B82F6',
  },

  iconGreen: {
    backgroundColor: '#10B981',
  },

  // 카드 텍스트
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 27,
  },

  cardDescription: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 19.5,
  },
});

export default styles;
