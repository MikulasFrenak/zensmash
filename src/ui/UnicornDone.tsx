/**
 * The session's happy ending: rainbow complete, stress gone,
 * you are officially a little unicorn. 🦄
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { UI } from '@/i18n/ui';
import { Locale } from '@/i18n/moments';
import { UnicornBadge } from '@/render/Unicorn';
import { colors } from '@/theme/colors';

interface Props {
  locale: Locale;
  broken: number;
  onClose: () => void;
}

export function UnicornDone({ locale, broken, onClose }: Props) {
  const t = UI[locale];
  // pick one celebration variant per completion, stable across re-renders
  const variant = useRef(
    t.doneVariants[Math.floor(Math.random() * t.doneVariants.length)],
  ).current;
  const fade = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const float = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

  return (
    <Animated.View style={[styles.backdrop, { opacity: fade }]}>
      <View style={styles.card}>
        <Animated.View style={[styles.unicorn, { transform: [{ translateY: float }] }]}>
          <UnicornBadge size={150} />
        </Animated.View>
        <Text style={styles.title}>{variant.title}</Text>
        <Text style={styles.text}>{variant.text}</Text>
        <Text style={styles.stat}>{t.blocksBroken(broken)}</Text>
        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{t.doneButton}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(246, 251, 247, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  card: { alignItems: 'center', paddingHorizontal: 32 },
  unicorn: { marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  text: {
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  stat: { fontSize: 14, color: colors.textSecondary, marginTop: 10 },
  button: {
    marginTop: 24,
    backgroundColor: colors.sage,
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 },
});
