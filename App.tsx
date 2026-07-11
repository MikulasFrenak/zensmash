import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { GameCanvas } from '@/render/GameCanvas';
import { LOCALES, LOCALE_LABELS, Locale } from '@/i18n/moments';
import { colors } from '@/theme/colors';

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');

  const cycleLocale = () => {
    const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];
    setLocale(next);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <GameCanvas locale={locale} />
      <Pressable style={styles.lang} onPress={cycleLocale} hitSlop={10}>
        <Text style={styles.langText}>{LOCALE_LABELS[locale]}</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  lang: {
    position: 'absolute',
    top: 58,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    opacity: 0.9,
  },
  langText: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
});
