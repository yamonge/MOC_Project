import {StyleSheet} from 'react-native';
import {typography} from '../../common/index';

export default StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1, // 정사각형 유지
    borderRadius: 20,
    padding: 10,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'visible',
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 8,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.3)',
      },
    ],
  },
  iconContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  iconImage: {
    width: 110,
    height: 110,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  title: {
    ...typography.body,
    fontSize: 14,
    color: '#10275a',
    textAlign: 'center',
    fontWeight: '500',
  },
  count: {
    ...typography.caption,
    fontSize: 12,
    color: '#12175d',
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
});
