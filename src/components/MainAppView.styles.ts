import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#0B1120',
  },
});
