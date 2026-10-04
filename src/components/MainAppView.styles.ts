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
  headerBarLandscape: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  headerBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 18,
  },
  appName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  companyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.colors.bgKeyAccent,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  companyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentBlue,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActionButtonText: {
    fontSize: 15,
  },
  infoButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  infoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  contentArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: THEME.colors.bgDark,
  },
  compactTab: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: THEME.colors.bgSurface,
  },
  compactTabActive: {
    backgroundColor: THEME.colors.accentBlue,
  },
  // Floating Nav Pill
  floatingNavWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 4,
    backgroundColor: THEME.colors.bgDark,
  },
  floatingNavWrapperLandscape: {
    paddingHorizontal: 40,
    paddingBottom: 4,
    paddingTop: 2,
  },
  floatingNavPill: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.bgKey,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  tabLabelActive: {
    color: THEME.colors.accentBlue,
    fontWeight: '700',
  },
  // Backward compatibility alias for tests
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: THEME.colors.bgDark,
  },
});


