import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 30,
  },

  // 상단 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: 110,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: 'white',
    lineHeight: 33,
  },

  headerSpacer: {
    width: 40,
  },

  // 카드 컨테이너
  cardsContainer: {
    gap: 20,
  },

  // 큰 카드 (사진 업로드)
  cardLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 24,
    paddingVertical: 24,
    height: 122,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },

  // 일반 카드 (직접 입력)
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 24,
    paddingVertical: 24,
    height: 112,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
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

  iconPink: {
    backgroundColor: '#EC4899',
  },

  iconBlue: {
    backgroundColor: '#3B82F6',
  },

  // 텍스트 영역
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 27,
  },

  cardDescription: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '400',
    color: '#525252',
    lineHeight: 19.5,
  },
});

export default styles;
