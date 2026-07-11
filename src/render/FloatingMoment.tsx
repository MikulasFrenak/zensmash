/**
 * T3: A little speech bubble that pops in over the broken block,
 * floats up and fades. Plain RN Animated — nothing to dismiss.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  text: string;
  x: number;
  y: number;
  onDone: () => void;
}

export function FloatingMoment({ text, x, y, onDone }: Props) {
  const { width } = useWindowDimensions();
  const rise = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Run exactly once — parent re-renders must NOT restart the animation,
  // and an interrupted animation must not remove the bubble early.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, { toValue: 1, duration: 2200, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDoneRef.current();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [0, -90] });
  const opacity = rise.interpolate({
    inputRange: [0, 0.08, 0.75, 1],
    outputRange: [0, 1, 1, 0],
  });

  const left = Math.min(Math.max(x - 120, 8), width - 248);
  const tailShift = Math.min(Math.max(x - left - 6, 16), 224);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { left, top: y - 58, opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={[styles.tail, { marginLeft: tailShift }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: 240,
    zIndex: 20,
  },
  bubble: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: colors.forest,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
    marginTop: -1,
  },
});
