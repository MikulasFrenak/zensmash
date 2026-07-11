/**
 * A funny animal visitor: peeks in from the side, waves at you 👋,
 * and wanders off. Pure delight, zero purpose — the best kind.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export const VISITORS = ['🐢', '🦆', '🐰', '🐸', '🦔', '🐿️', '🐧', '🐌'];

interface Props {
  emoji: string;
  side: 'left' | 'right';
  onDone: () => void;
}

export function Visitor({ emoji, side, onDone }: Props) {
  const slide = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    Animated.sequence([
      // wander in
      Animated.timing(slide, { toValue: 1, duration: 900, useNativeDriver: true }),
      // wave hello, three times
      Animated.loop(
        Animated.sequence([
          Animated.timing(wave, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(wave, { toValue: -1, duration: 220, useNativeDriver: true }),
        ]),
        { iterations: 3 },
      ),
      Animated.timing(wave, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.delay(400),
      // wander off
      Animated.timing(slide, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDoneRef.current();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: side === 'left' ? [-70, 24] : [70, -24],
  });
  const rotate = wave.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-16deg', '16deg'],
  });
  const handOpacity = wave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0.4, 1],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        side === 'left' ? { left: 0 } : { right: 0 },
        { transform: [{ translateX }] },
      ]}
    >
      <Animated.Text style={[styles.hand, { opacity: handOpacity }]}>👋</Animated.Text>
      <Animated.Text
        style={[styles.animal, { transform: [{ rotate }, ...(side === 'right' ? [{ scaleX: -1 }] : [])] }]}
      >
        {emoji}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 92,
    alignItems: 'center',
    zIndex: 12,
  },
  hand: { fontSize: 18, marginBottom: -4 },
  animal: { fontSize: 40 },
});
