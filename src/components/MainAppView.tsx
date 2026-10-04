import React, { useState } from 'react';
import {
  Linking,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../theme/theme';
import { CreditsModal } from './CreditsModal';
import { styles } from './MainAppView.styles';
import { PairingScreen } from './PairingScreen';
import { PermissionsDashboard } from './PermissionsDashboard';
import { Trackpad } from './Trackpad';
import { VirtualKeyboard } from './VirtualKeyboard';

export type ActiveTab = 'trackpad' | 'keyboard' | 'pairing' | 'bluetooth';

export function MainAppView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('trackpad');
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleOpenBrand = () => {
    Linking.openURL(THEME.branding.website).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Top Header Bar with Digi VirtualKeyboard Branding */}
      <View
        style={[
          styles.headerBar,
          isLandscape && styles.headerBarLandscape,
        ]}>
        <View style={styles.headerBranding}>
          <Text style={styles.appName}>{THEME.branding.name}</Text>
          <TouchableOpacity
            style={styles.companyBadge}
            onPress={handleOpenBrand}
            activeOpacity={0.8}>
            <Text style={styles.companyBadgeText}>by {THEME.branding.company}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowCredits(true)}
            activeOpacity={0.7}>
            <Text style={styles.infoButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Tab Screen */}
      <View style={styles.contentArea}>
        {activeTab === 'trackpad' && <Trackpad />}
        {activeTab === 'keyboard' && (
          <View style={styles.keyboardContainer}>
            <VirtualKeyboard />
          </View>
        )}
        {activeTab === 'pairing' && <PairingScreen />}
        {activeTab === 'bluetooth' && <PermissionsDashboard />}
      </View>

      {/* Modern Floating Bottom Nav Pill */}
      <View
        style={[
          styles.floatingNavWrapper,
          isLandscape && styles.floatingNavWrapperLandscape,
        ]}>
        <View style={styles.floatingNavPill}>
          <TouchableOpacity
            testID="tab-keyboard"
            style={[
              styles.tabButton,
              activeTab === 'keyboard' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('keyboard')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'keyboard' && styles.tabLabelActive,
              ]}>
              Keyboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-trackpad"
            style={[
              styles.tabButton,
              activeTab === 'trackpad' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('trackpad')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'trackpad' && styles.tabLabelActive,
              ]}>
              Trackpad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-pairing"
            style={[
              styles.tabButton,
              activeTab === 'pairing' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('pairing')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'pairing' && styles.tabLabelActive,
              ]}>
              Pairing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-bluetooth"
            style={[
              styles.tabButton,
              activeTab === 'bluetooth' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('bluetooth')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'bluetooth' && styles.tabLabelActive,
              ]}>
              Setup
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Credits / Info Modal */}
      <CreditsModal
        visible={showCredits}
        onClose={() => setShowCredits(false)}
      />
    </SafeAreaView>
  );
}



