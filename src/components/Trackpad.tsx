import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import { styles } from './Trackpad.styles';

const SENSITIVITIES = [1.0, 1.5, 2.0, 2.5] as const;

export function Trackpad() {
  const { sendMouse, connectionState, connectedDevice } = useBluetoothHid();
  const [sensitivity, setSensitivity] = useState<number>(1.5);

  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);
  const lastSendTime = useRef<number>(0);
  const accumulatedX = useRef<number>(0);
  const accumulatedY = useRef<number>(0);

  const panRef = useRef(null);
  const singleTapRef = useRef(null);
  const twoFingerTapRef = useRef(null);

  // 1-finger tap -> Left Click
  const triggerLeftClick = useCallback(() => {
    sendMouse(1, 0, 0, 0);
    setTimeout(() => {
      sendMouse(0, 0, 0, 0);
    }, 40);
  }, [sendMouse]);

  // 2-finger tap -> Right Click
  const triggerRightClick = useCallback(() => {
    sendMouse(2, 0, 0, 0);
    setTimeout(() => {
      sendMouse(0, 0, 0, 0);
    }, 40);
  }, [sendMouse]);

  const handleSingleTap = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        triggerLeftClick();
      }
    },
    [triggerLeftClick],
  );

  const handleTwoFingerTap = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        triggerRightClick();
      }
    },
    [triggerRightClick],
  );

  // Pan gesture tracking and 16ms throttling
  const handlePanGesture = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const { translationX, translationY, numberOfPointers } = event.nativeEvent;
      const rawDx = translationX - lastX.current;
      const rawDy = translationY - lastY.current;
      lastX.current = translationX;
      lastY.current = translationY;

      if (Math.abs(rawDx) > 80 || Math.abs(rawDy) > 80) return;

      if (numberOfPointers === 2) {
        // Two-finger vertical scroll
        const scrollDelta = Math.round(-rawDy * 0.35);
        if (scrollDelta !== 0) {
          sendMouse(0, 0, 0, scrollDelta);
        }
      } else {
        // Single finger mouse cursor displacement
        accumulatedX.current += rawDx * sensitivity;
        accumulatedY.current += rawDy * sensitivity;

        const now = Date.now();
        if (now - lastSendTime.current >= 16) {
          const sendX = Math.round(accumulatedX.current);
          const sendY = Math.round(accumulatedY.current);
          if (sendX !== 0 || sendY !== 0) {
            sendMouse(0, sendX, sendY, 0);
            accumulatedX.current = 0;
            accumulatedY.current = 0;
            lastSendTime.current = now;
          }
        }
      }
    },
    [sendMouse, sensitivity],
  );

  const handlePanStateChange = useCallback(
    (event: PanGestureHandlerStateChangeEvent) => {
      const state = event.nativeEvent.state;
      if (state === State.BEGAN || state === State.ACTIVE) {
        lastX.current = 0;
        lastY.current = 0;
        accumulatedX.current = 0;
        accumulatedY.current = 0;
        lastSendTime.current = Date.now();
      } else if (
        state === State.END ||
        state === State.CANCELLED ||
        state === State.FAILED
      ) {
        const sendX = Math.round(accumulatedX.current);
        const sendY = Math.round(accumulatedY.current);
        if (sendX !== 0 || sendY !== 0) {
          sendMouse(0, sendX, sendY, 0);
        }
        lastX.current = 0;
        lastY.current = 0;
        accumulatedX.current = 0;
        accumulatedY.current = 0;
      }
    },
    [sendMouse],
  );

  const isConnected = connectionState === 'CONNECTED';

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.statusText}>
          {isConnected ? (
            <Text style={styles.statusConnected}>
              🖱️ {connectedDevice?.name ?? 'Connected Host'}
            </Text>
          ) : (
            '⚠️ Mouse Disconnected'
          )}
        </Text>

        <View style={styles.sensitivityContainer}>
          <Text style={styles.sensitivityLabel}>Speed:</Text>
          {SENSITIVITIES.map(s => {
            const isActive = s === sensitivity;
            return (
              <TouchableOpacity
                key={`sens-${s}`}
                style={[
                  styles.sensitivityPill,
                  isActive && styles.sensitivityPillActive,
                ]}
                onPress={() => setSensitivity(s)}>
                <Text
                  style={[
                    styles.sensitivityText,
                    isActive && styles.sensitivityTextActive,
                  ]}>
                  {s}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Trackpad Surface */}
      <View style={styles.trackpadArea}>
        <TapGestureHandler
          ref={twoFingerTapRef}
          minPointers={2}
          onHandlerStateChange={handleTwoFingerTap}>
          <View style={StyleSheet.absoluteFill}>
            <TapGestureHandler
              ref={singleTapRef}
              minPointers={1}
              waitFor={twoFingerTapRef}
              onHandlerStateChange={handleSingleTap}>
              <View style={StyleSheet.absoluteFill}>
                <PanGestureHandler
                  ref={panRef}
                  simultaneousHandlers={[singleTapRef, twoFingerTapRef]}
                  minPointers={1}
                  maxPointers={2}
                  onGestureEvent={handlePanGesture}
                  onHandlerStateChange={handlePanStateChange}>
                  <View style={styles.trackpadSurface}>
                    <Text style={styles.trackpadHint}>
                      1 Finger: Move Cursor{'\n'}
                      1 Finger Tap: Left Click{'\n'}
                      2 Finger Tap: Right Click{'\n'}
                      2 Finger Drag: Scroll
                    </Text>
                  </View>
                </PanGestureHandler>
              </View>
            </TapGestureHandler>
          </View>
        </TapGestureHandler>
      </View>

      {/* Hardware-style bottom click buttons with Center Scroll Pad */}
      <View style={styles.mouseButtonsRow}>
        <Pressable
          testID="trackpad-left-click"
          style={({ pressed }) => [
            styles.mouseButton,
            pressed && styles.mouseButtonPressed,
          ]}
          onPressIn={() => sendMouse(1, 0, 0, 0)}
          onPressOut={() => sendMouse(0, 0, 0, 0)}>
          <Text style={styles.mouseButtonText}>LEFT CLICK</Text>
          <Text style={styles.mouseButtonSubText}>(Primary)</Text>
        </Pressable>

        {/* Scroll & Middle Click Center Pad */}
        <View style={styles.scrollCenterPad}>
          <Pressable
            style={({ pressed }) => [
              styles.scrollButton,
              pressed && styles.mouseButtonPressed,
            ]}
            onPress={() => sendMouse(0, 0, 0, 1)}>
            <Text style={styles.scrollArrowText}>▲</Text>
          </Pressable>

          <Pressable
            testID="trackpad-middle-click"
            style={({ pressed }) => [
              styles.middleClickButton,
              pressed && styles.mouseButtonPressed,
            ]}
            onPressIn={() => sendMouse(4, 0, 0, 0)}
            onPressOut={() => sendMouse(0, 0, 0, 0)}>
            <Text style={styles.middleClickText}>SCROLL</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.scrollButton,
              pressed && styles.mouseButtonPressed,
            ]}
            onPress={() => sendMouse(0, 0, 0, -1)}>
            <Text style={styles.scrollArrowText}>▼</Text>
          </Pressable>
        </View>

        <Pressable
          testID="trackpad-right-click"
          style={({ pressed }) => [
            styles.mouseButton,
            pressed && styles.mouseButtonPressed,
          ]}
          onPressIn={() => sendMouse(2, 0, 0, 0)}
          onPressOut={() => sendMouse(0, 0, 0, 0)}>
          <Text style={styles.mouseButtonText}>RIGHT CLICK</Text>
          <Text style={styles.mouseButtonSubText}>(Context Menu)</Text>
        </Pressable>
      </View>
    </View>
  );
}
