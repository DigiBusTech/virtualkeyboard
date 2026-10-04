import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeConnected: { backgroundColor: '#064E3B' },
  badgeTextConnected: { color: '#34D399' },
  badgeDisconnected: { backgroundColor: '#334155' },
  badgeTextDisconnected: { color: '#94A3B8' },
  badgeConnecting: { backgroundColor: '#78350F' },
  badgeTextConnecting: { color: '#FBBF24' },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  infoPill: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoPillLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoPillValue: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  pillValueRegistered: {
    color: '#34D399',
  },
  pillValueInactive: {
    color: '#94A3B8',
  },
  deviceSection: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#334155',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1E293B',
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  deviceAddress: {
    fontSize: 11,
    color: '#64748B',
  },
  deviceConnectButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deviceConnectButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noDevicesText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
  },
  secondaryBtn: {
    backgroundColor: '#334155',
  },
  dangerBtn: {
    backgroundColor: '#991B1B',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  testRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  testBtn: {
    flex: 1,
    backgroundColor: '#0F766E',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#CCFBF1',
    fontSize: 11,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#450A0A',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 11,
  },
});
