import React, { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trackpad } from './Trackpad';
import { VirtualKeyboard } from './VirtualKeyboard';
import { PairingScreen } from './PairingScreen';
import { PermissionsDashboard } from './PermissionsDashboard';
import { styles } from './MainAppView.styles';

export type ActiveTab = 'trackpad' | 'keyboard' | 'pairing' | 'bluetooth';

export function MainAppView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('trackpad');
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Tab Switcher Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          testID="tab-trackpad"
          style={[
            styles.tabButton,
            activeTab === 'trackpad' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('trackpad')}>
          <Text style={styles.tabIcon}>🖱️</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'trackpad' && styles.tabLabelActive,
            ]}>
            Trackpad
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-keyboard"
          style={[
            styles.tabButton,
            activeTab === 'keyboard' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('keyboard')}>
          <Text style={styles.tabIcon}>⌨️</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'keyboard' && styles.tabLabelActive,
            ]}>
            Keyboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-pairing"
          style={[
            styles.tabButton,
            activeTab === 'pairing' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('pairing')}>
          <Text style={styles.tabIcon}>🔍</Text>
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
          onPress={() => setActiveTab('bluetooth')}>
          <Text style={styles.tabIcon}>📶</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'bluetooth' && styles.tabLabelActive,
            ]}>
            Setup
          </Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
}

