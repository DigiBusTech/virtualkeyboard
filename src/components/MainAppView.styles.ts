import { StyleSheet } from 'react-native';
import { THEME } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bgDark,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.colors.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  headerBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  companyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  companyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accentCyan,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  infoButtonText: {
    fontSize: 13,
  },
  contentArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: THEME.colors.bgDark,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: THEME.colors.bgDark,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    gap: 3,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.accentBlue,
    borderColor: THEME.colors.accentCyan,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});

