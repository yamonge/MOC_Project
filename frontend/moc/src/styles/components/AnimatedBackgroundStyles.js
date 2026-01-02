import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  // 흐릿한 원형들
  circleTop: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: 70,
    left: 40,
  },

  circleTopRight: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 240, 133, 0.3)',
    opacity: 0.5,
    top: 200,
    left: 255,
  },

  circleLeft: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(253, 165, 213, 0.2)',
    top: 390,
    left: 60,
  },

  // 요리 아이콘들
  iconChef: {
    position: 'absolute',
    width: 36,
    height: 36,
    top: 117,
    left: 289,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconUtensils: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 250,
    left: 30,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconSparkles: {
    position: 'absolute',
    width: 28,
    height: 28,
    top: 495,
    left: 307,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 페이지네이션 인디케이터
  paginationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 8,
    bottom: 48,
    left: width / 2 - 20,
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});

export default styles;
