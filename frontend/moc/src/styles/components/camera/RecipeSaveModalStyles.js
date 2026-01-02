import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../common';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 327,
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: '#D4F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.body.fontFamily,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.body.fontFamily,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: '#00B8DB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: typography.body.fontFamily,
    color: colors.textWhite,
    lineHeight: 24,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: typography.body.fontFamily,
    color: colors.textDark,
    lineHeight: 24,
  },
});

export default styles;
