import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../theme/theme';

export type TabType = 'trackpad' | 'keyboard' | 'pairing' | 'setup';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isConnected: boolean;
}

export function BottomNavBar({
  currentTab,
  onSelectTab,
  isConnected,
}: BottomNavBarProps) {
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'keyboard', label: 'Keyboard', icon: '\u2328' },
    { key: 'trackpad', label: 'Trackpad', icon: '\uD83D\uDDB1' },
    { key: 'pairing', label: 'Pairing', icon: '\uD83D\uDCE1' },
    { key: 'setup', label: 'Setup', icon: '\u2699' },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.navBar}>
        {tabs.map(tab => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive ? <View style={styles.activeGlowDot} /> : null}
              {tab.key === 'pairing' && isConnected ? (
                <View style={styles.connectedDot} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: THEME.colors.bgDark,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 24,
    padding: 6,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.bgCardElevated,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: THEME.colors.accentCyan,
  },
  activeGlowDot: {
    position: 'absolute',
    bottom: 3,
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: THEME.colors.accentCyan,
  },
  connectedDot: {
    position: 'absolute',
    top: 6,
    right: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.accentEmerald,
  },
});

