import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface DigiBusLogoProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Official DigiBusTech Code Bracket Mark (`< / >`)
 * Renders the electric blue curved angle brackets and diagonal slash.
 */
export function DigiBusLogo({ size = 32, color = '#2563EB', style }: DigiBusLogoProps) {
  const strokeWidth = Math.max(2.5, size * 0.12);
  const armLength = size * 0.38;

  return (
    <View style={[styles.container, { width: size * 1.3, height: size }, style]}>
      {/* Left Bracket `<` */}
      <View
        style={[
          styles.bracketWrapper,
          { width: armLength, height: size * 0.72 },
        ]}>
        <View
          style={[
            styles.armTop,
            {
              backgroundColor: color,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              transform: [{ rotate: '-45deg' }, { translateX: -armLength * 0.1 }],
            },
          ]}
        />
        <View
          style={[
            styles.armBottom,
            {
              backgroundColor: color,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              transform: [{ rotate: '45deg' }, { translateX: -armLength * 0.1 }],
            },
          ]}
        />
      </View>

      {/* Center Slash `/` */}
      <View
        style={[
          styles.slash,
          {
            backgroundColor: color,
            width: strokeWidth * 0.95,
            height: size * 0.88,
            borderRadius: strokeWidth / 2,
            transform: [{ rotate: '20deg' }],
            marginHorizontal: size * 0.08,
          },
        ]}
      />

      {/* Right Bracket `>` */}
      <View
        style={[
          styles.bracketWrapper,
          { width: armLength, height: size * 0.72 },
        ]}>
        <View
          style={[
            styles.armTop,
            {
              backgroundColor: color,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              transform: [{ rotate: '45deg' }, { translateX: armLength * 0.1 }],
            },
          ]}
        />
        <View
          style={[
            styles.armBottom,
            {
              backgroundColor: color,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              transform: [{ rotate: '-45deg' }, { translateX: armLength * 0.1 }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracketWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  armTop: {
    position: 'absolute',
    width: '100%',
    top: '32%',
  },
  armBottom: {
    position: 'absolute',
    width: '100%',
    bottom: '32%',
  },
  slash: {
    alignSelf: 'center',
  },
});
