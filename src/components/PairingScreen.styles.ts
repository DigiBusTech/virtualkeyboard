import { StyleSheet } from 'react-native';
import { THEME } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bgDark,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: THEME.colors.accentBlue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stopBtn: {
    backgroundColor: THEME.colors.accentRose,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: THEME.colors.bgSurface,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  deviceList: {
    gap: 8,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.bgInput,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  deviceCardActive: {
    borderColor: THEME.colors.accentEmerald,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 8,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  deviceAddress: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  connectBtn: {
    backgroundColor: THEME.colors.accentBlue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disconnectBtn: {
    backgroundColor: THEME.colors.accentRose,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 14,
  },
  infoBox: {
    backgroundColor: THEME.colors.bgSurface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accentBlue,
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: THEME.colors.errorBg,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: THEME.colors.errorText,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});


