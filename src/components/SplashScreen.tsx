import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../theme/theme';
import { styles } from './SplashScreen.styles';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Subtle rotation for logo accent ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Content fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Progress bar fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Auto finish after 2.2s
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish, progressAnim, pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleOpenWebsite = () => {
    Linking.openURL(THEME.branding.website).catch(() => {});
  };

  const orbStyle = [styles.glowOrb, { transform: [{ scale: pulseAnim }] }];
  const contentStyle = [styles.content, { opacity: fadeAnim }];
  const ringStyle = [styles.outerRing, { transform: [{ rotate: spin }] }];
  const badgeStyle = [styles.logoBadge, { transform: [{ scale: pulseAnim }] }];
  const barStyle = [styles.progressBar, { width: progressWidth }];

  return (
    <View style={styles.container}>
      {/* Background glow circle */}
      <Animated.View style={orbStyle}></Animated.View>

      <Animated.View style={contentStyle}>
        {/* Animated Logo Container */}
        <View style={styles.logoWrapper}>
          <Animated.View style={ringStyle}></Animated.View>
          <Animated.View style={badgeStyle}>
            <Text style={styles.logoEmoji}>{'\u2328\uFE0F'}</Text>
          </Animated.View>
        </View>

        {/* Title & Tagline */}
        <Text style={styles.appTitle}>Virtual HID</Text>
        <Text style={styles.appSubtitle}>
          Serverless Bluetooth Mouse & Keyboard
        </Text>

        {/* Brand Credit */}
        <TouchableOpacity
          style={styles.brandBadge}
          onPress={handleOpenWebsite}
          activeOpacity={0.8}>
          <Text style={styles.brandLabel}>POWERED BY</Text>
          <Text style={styles.brandName}>{THEME.branding.company}</Text>
          <Text style={styles.brandUrl}>digibustech.com {'\u2197'}</Text>
        </TouchableOpacity>

        {/* Progress Preloader Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={barStyle}></Animated.View>
        </View>
        <Text style={styles.loadingText}>Initializing Bluetooth HID Profile...</Text>

        {/* Skip button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onFinish}
          activeOpacity={0.7}>
          <Text style={styles.skipText}>Tap anywhere to start {'\u2192'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

