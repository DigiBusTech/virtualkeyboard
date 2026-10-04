import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeKeyPreview: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  keyboardGrid: {
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  key: {
    height: 44,
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  keyPressed: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
    transform: [{ scale: 0.96 }],
  },
  modifierActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#93C5FD',
  },
  keyText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  keyTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  shiftSubText: {
    fontSize: 9,
    color: '#64748B',
    position: 'absolute',
    top: 2,
    right: 4,
  },
  spaceKey: {
    flex: 4.5,
  },
});
