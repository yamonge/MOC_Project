import {StyleSheet} from 'react-native';
import {typography} from '../../common/index';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 92,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 10,
        blurRadius: 10,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.15)',
      },
    ],
  },

  // 아이콘 영역
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...typography.title,
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
  },

  // 재료명
  name: {
    ...typography.title,
    fontSize: 20,
    color: '#0a0a0a',
    fontWeight: '700',
    flex: 1,
  },

  // 삭제 버튼
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 4,
  },
  deleteButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
