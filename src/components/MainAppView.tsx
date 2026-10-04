import React, { useState } from 'react';
import {
  Linking,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../theme/theme';
import { CreditsModal } from './CreditsModal';
import { styles } from './MainAppView.styles';
import { PairingScreen } from './PairingScreen';
import { PermissionsDashboard } from './PermissionsDashboard';
import { Trackpad } from './Trackpad';
import { VirtualKeyboard } from './VirtualKeyboard';

export type ActiveTab = 'trackpad' | 'keyboard' | 'pairing' | 'bluetooth';

export function MainAppView() {
  const { isDark, theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('trackpad');
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleOpenBrand = () => {
    Linking.openURL(THEME.branding.website).catch(() => {});
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bgDark }]}
      edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header Bar with Digi VirtualKeyboard Branding & Theme Toggle */}
      <View
        style={[
          styles.headerBar,
          { backgroundColor: theme.bgDark, borderBottomColor: theme.borderSubtle },
          isLandscape && styles.headerBarLandscape,
        ]}>
        <View style={styles.headerBranding}>
          <Text style={[styles.appName, { color: theme.textPrimary }]}>{THEME.branding.name}</Text>
          <TouchableOpacity
            style={[styles.companyBadge, { backgroundColor: theme.bgKeyAccent }]}
            onPress={handleOpenBrand}
            activeOpacity={0.8}>
            <Text style={[styles.companyBadgeText, { color: theme.accentBlue }]}>
              by {THEME.branding.company}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          {/* Quick tab switcher in landscape header */}
          {isLandscape && (
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <TouchableOpacity
                style={[
                  styles.compactTab,
                  activeTab === 'keyboard' && styles.compactTabActive,
                ]}
                onPress={() => setActiveTab('keyboard')}>
                <Text style={{ fontSize: 13 }}>{'\u2328'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.compactTab,
                  activeTab === 'trackpad' && styles.compactTabActive,
                ]}
                onPress={() => setActiveTab('trackpad')}>
                <Text style={{ fontSize: 13 }}>{'\uD83D\uDDB1'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.compactTab,
                  activeTab === 'pairing' && styles.compactTabActive,
                ]}
                onPress={() => setActiveTab('pairing')}>
                <Text style={{ fontSize: 13 }}>{'\uD83D\uDCE1'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.compactTab,
                  activeTab === 'bluetooth' && styles.compactTabActive,
                ]}
                onPress={() => setActiveTab('bluetooth')}>
                <Text style={{ fontSize: 13 }}>{'\u2699'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Light / Dark Mode Global Toggle */}
          <TouchableOpacity
            testID="theme-toggle"
            style={[
              styles.infoButton,
              { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}>
            <Text style={[styles.infoButtonText, { color: theme.textSecondary }]}>
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.infoButton,
              { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle },
            ]}
            onPress={() => setShowCredits(true)}
            activeOpacity={0.7}>
            <Text style={[styles.infoButtonText, { color: theme.textSecondary }]}>
              Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Tab Screen */}
      <View style={styles.contentArea}>
        {activeTab === 'trackpad' && <Trackpad />}
        {activeTab === 'keyboard' && (
          <View style={[styles.keyboardContainer, { backgroundColor: theme.bgDark }]}>
            <VirtualKeyboard />
          </View>
        )}
        {activeTab === 'pairing' && <PairingScreen />}
        {activeTab === 'bluetooth' && <PermissionsDashboard />}
      </View>

      {/* Modern Floating Bottom Nav Pill with Icons (Portrait only) */}
      {!isLandscape && (
        <View
          style={[
            styles.floatingNavWrapper,
            { backgroundColor: theme.bgDark },
          ]}>
          <View
            style={[
              styles.floatingNavPill,
              { backgroundColor: theme.bgCard, borderColor: theme.borderSubtle },
            ]}>
            <TouchableOpacity
              testID="tab-keyboard"
              style={[
                styles.tabButton,
                activeTab === 'keyboard' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.bgKey, borderColor: theme.borderMedium },
                ],
              ]}
              onPress={() => setActiveTab('keyboard')}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{'\u2328'}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.textMuted },
                  activeTab === 'keyboard' && [
                    styles.tabLabelActive,
                    { color: theme.accentBlue },
                  ],
                ]}>
                Keyboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="tab-trackpad"
              style={[
                styles.tabButton,
                activeTab === 'trackpad' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.bgKey, borderColor: theme.borderMedium },
                ],
              ]}
              onPress={() => setActiveTab('trackpad')}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{'\uD83D\uDDB1'}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.textMuted },
                  activeTab === 'trackpad' && [
                    styles.tabLabelActive,
                    { color: theme.accentBlue },
                  ],
                ]}>
                Trackpad
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="tab-pairing"
              style={[
                styles.tabButton,
                activeTab === 'pairing' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.bgKey, borderColor: theme.borderMedium },
                ],
              ]}
              onPress={() => setActiveTab('pairing')}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{'\uD83D\uDCE1'}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.textMuted },
                  activeTab === 'pairing' && [
                    styles.tabLabelActive,
                    { color: theme.accentBlue },
                  ],
                ]}>
                Pairing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="tab-bluetooth"
              style={[
                styles.tabButton,
                activeTab === 'bluetooth' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.bgKey, borderColor: theme.borderMedium },
                ],
              ]}
              onPress={() => setActiveTab('bluetooth')}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{'\u2699'}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.textMuted },
                  activeTab === 'bluetooth' && [
                    styles.tabLabelActive,
                    { color: theme.accentBlue },
                  ],
                ]}>
                Setup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Credits / Info Modal */}
      <CreditsModal
        visible={showCredits}
        onClose={() => setShowCredits(false)}
      />
    </SafeAreaView>
  );
}



