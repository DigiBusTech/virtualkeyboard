import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  statusConnected: {
    color: '#34D399',
    fontWeight: '700',
  },
  sensitivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sensitivityLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sensitivityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  sensitivityPillActive: {
    backgroundColor: '#2563EB',
  },
  sensitivityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  sensitivityTextActive: {
    color: '#FFFFFF',
  },
  trackpadArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0B1120',
  },
  trackpadSurface: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackpadHint: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollStrip: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderLeftWidth: 1,
    borderLeftColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollStripText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 2,
    transform: [{ rotate: '90deg' }],
  },
  mouseButtonsRow: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#1E293B',
  },
  mouseButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  mouseButtonPressed: {
    backgroundColor: '#2563EB',
  },
  mouseButtonDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  mouseButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  mouseButtonSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
