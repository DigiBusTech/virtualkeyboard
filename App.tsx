import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainAppView } from './src/components/MainAppView';
import { SplashScreen } from './src/components/SplashScreen';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          {!isReady ? (
            <SplashScreen onFinish={() => setIsReady(true)} />
          ) : (
            <MainAppView />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1014',
  },
});




