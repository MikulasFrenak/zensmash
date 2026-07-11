/**
 * T3: A short line that floats up from a broken block and fades.
 * Plain RN Animated — no worklets, nothing to dismiss, never blocks taps.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  text: string;
  x: number;
  y: number;
  onDone: () => void;
}

export function FloatingMoment({ text, x, y, onDone }: Props) {
  const { width } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: true,
    }).start(() => onDone());
  }, [progress, onDone]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -56] });
  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.7, 1],
    outputRange: [0, 1, 1, 0],
  });

  const left = Math.min(Math.max(x - 110, 8), width - 228);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.bubble, { left, top: y - 44, transform: [{ translateY }], opacity }]}
    >
      <Animated.Text style={styles.text}>{text}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: 220,
    alignItems: 'center',
  },
  text: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
