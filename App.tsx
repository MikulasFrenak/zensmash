import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { GameCanvas } from '@/render/GameCanvas';
import { ZenMenu } from '@/ui/ZenMenu';
import { Locale } from '@/i18n/moments';
import { colors } from '@/theme/colors';

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [broken, setBroken] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <GameCanvas locale={locale} onBlockBroken={() => setBroken((b) => b + 1)} />

      <Pressable style={styles.zen} onPress={() => setMenuOpen(true)} hitSlop={10}>
        <Text style={styles.zenText}>🌿</Text>
      </Pressable>

      {menuOpen && (
        <ZenMenu
          broken={broken}
          locale={locale}
          onLocaleChange={setLocale}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  zen: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  zenText: { fontSize: 20 },
});
