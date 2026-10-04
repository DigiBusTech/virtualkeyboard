import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 20, gap: 16 },
  header: { alignItems: 'center', marginVertical: 8 },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
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
  bodyText: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  betweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  pillLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  pillValue: { fontSize: 11, color: '#F8FAFC', fontWeight: '700' },
  errorText: { marginTop: 8, color: '#EF4444', fontSize: 12 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusTagText: { fontSize: 10, fontWeight: '700' },
  manifestRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  manifestTitle: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  manifestList: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '500',
  },
  permItem: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  permTitle: { fontSize: 14, fontWeight: '600' },
  permTag: { fontSize: 12, fontWeight: '700' },
  permDesc: { fontSize: 12, color: '#64748B', marginTop: 3 },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  phaseTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  phaseDesc: { fontSize: 12, lineHeight: 17 },
  pillReady: {
    backgroundColor: '#064E3B',
  },
  pillIncompatible: {
    backgroundColor: '#7F1D1D',
  },
  pillValueReady: {
    color: '#34D399',
  },
  pillValueIncompatible: {
    color: '#F87171',
  },
  statusTagSuccess: {
    backgroundColor: '#064E3B',
  },
  statusTagPending: {
    backgroundColor: '#450A0A',
  },
  statusTagTextSuccess: {
    color: '#34D399',
  },
  statusTagTextPending: {
    color: '#F87171',
  },
  permTagGranted: {
    color: '#10B981',
  },
  permTagDenied: {
    color: '#EF4444',
  },
  phaseCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  phaseCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  phaseCardCompleteDark: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  phaseCardCompleteLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  phaseTitleComplete: {
    color: '#10B981',
  },
  phaseTitleIncompleteDark: {
    color: '#F8FAFC',
  },
  phaseTitleIncompleteLight: {
    color: '#0F172A',
  },
  safeAreaDark: {
    backgroundColor: '#0F172A',
  },
  safeAreaLight: {
    backgroundColor: '#F8FAFC',
  },
  cardDark: {
    backgroundColor: '#1E293B',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  textDark: {
    color: '#F8FAFC',
  },
  textLight: {
    color: '#0F172A',
  },
  descDark: {
    color: '#CBD5E1',
  },
  descLight: {
    color: '#475569',
  },
});

