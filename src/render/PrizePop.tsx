/**
 * The freed prize: emoji pops out of a broken block, bounces up and fades.
 * Runs exactly once — immune to parent re-renders.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  emoji: string;
  x: number;
  y: number;
  onDone: () => void;
}

export function PrizePop({ emoji, x, y, onDone }: Props) {
  const rise = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.2)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.5, friction: 4, tension: 90, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDoneRef.current();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [0, -70] });
  const opacity = rise.interpolate({
    inputRange: [0, 0.1, 0.7, 1],
    outputRange: [0.6, 1, 1, 0],
  });

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.emoji,
        { left: x - 22, top: y - 22, opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    fontSize: 36,
    zIndex: 15,
  },
});
