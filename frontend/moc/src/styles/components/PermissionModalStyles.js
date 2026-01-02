import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '500',
    color: '#6B7280',
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },

  confirmButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default styles;
