/**
 * T3: A happy line riding a real fluffy cloud — same silhouette as the
 * header sky clouds (overlapping puffs), floating up and dissolving.
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
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const driftDir = useRef(Math.random() < 0.5 ? -1 : 1).current;

  // Run exactly once — parent re-renders must NOT restart the animation.
  useEffect(() => {
    Animated.timing(rise, { toValue: 1, duration: 3200, useNativeDriver: true }).start(
      ({ finished }) => {
        if (finished) onDoneRef.current();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [0, -140] });
  const translateX = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0, driftDir * 34],
  });
  const opacity = rise.interpolate({
    inputRange: [0, 0.08, 0.7, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = rise.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0.6, 1, 1.06] });

  const left = Math.min(Math.max(x - 130, 4), width - 264);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { left, top: y - 92, opacity, transform: [{ translateY }, { translateX }, { scale }] },
      ]}
    >
      {/* cloud silhouette — overlapping puffs, like the sky clouds */}
      <View style={[styles.puff, { width: 88, height: 88, borderRadius: 44, top: 10, left: 86 }]} />
      <View style={[styles.puff, { width: 68, height: 68, borderRadius: 34, top: 26, left: 36 }]} />
      <View style={[styles.puff, { width: 68, height: 68, borderRadius: 34, top: 24, right: 36 }]} />
      <View style={[styles.puff, { width: 52, height: 52, borderRadius: 26, top: 30, left: 6 }]} />
      <View style={[styles.puff, { width: 52, height: 52, borderRadius: 26, top: 32, right: 6 }]} />
      <View style={[styles.puff, { width: 54, height: 54, borderRadius: 27, top: 0, left: 62 }]} />
      <View style={[styles.puff, { width: 48, height: 48, borderRadius: 24, top: 4, right: 66 }]} />
      {/* the words, resting on the cloud */}
      <View style={styles.textBox}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: 260,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  puff: {
    position: 'absolute',
    backgroundColor: colors.surface,
    shadowColor: colors.forest,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  textBox: {
    maxWidth: 210,
    paddingHorizontal: 8,
    zIndex: 2,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
