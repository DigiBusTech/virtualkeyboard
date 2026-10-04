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
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
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
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.accentCyan,
    letterSpacing: 1.2,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 4,
  },
  stopBtn: {
    backgroundColor: THEME.colors.accentRose,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: THEME.colors.bgSurface,
    paddingVertical: 12,
    borderRadius: 10,
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 8,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  deviceAddress: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 3,
  },
  connectBtn: {
    backgroundColor: THEME.colors.accentBlue,
    paddingHorizontal: 16,
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
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.accentCyan,
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  errorText: {
    color: THEME.colors.accentRose,
    fontSize: 12,
    marginTop: 8,
  },
});

