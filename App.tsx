import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { GameCanvas } from '@/render/GameCanvas';
import { Visitor, VISITORS } from '@/render/Visitor';
import { ZenMenu } from '@/ui/ZenMenu';
import { CollectionModal } from '@/ui/CollectionModal';
import { totalCollected, useCollection } from '@/state/collection';
import { Locale } from '@/locales/moments';
import { colors } from '@/theme/colors';

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [broken, setBroken] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [treasuresOpen, setTreasuresOpen] = useState(false);
  const collected = totalCollected(useCollection());
  const [visitor, setVisitor] = useState<{ key: number; emoji: string; side: 'left' | 'right' } | null>(null);

  // a funny animal drops by every now and then to wave at you
  useEffect(() => {
    if (visitor) return;
    const id = setTimeout(() => {
      setVisitor({
        key: Date.now(),
        emoji: VISITORS[Math.floor(Math.random() * VISITORS.length)],
        side: Math.random() < 0.5 ? 'left' : 'right',
      });
    }, 12000 + Math.random() * 20000);
    return () => clearTimeout(id);
  }, [visitor]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <GameCanvas locale={locale} onBlockBroken={() => setBroken((b) => b + 1)} />

      <View style={styles.bottomBar} pointerEvents="box-none">
        <Pressable style={styles.roundButton} onPress={() => setMenuOpen(true)} hitSlop={10}>
          <Text style={styles.zenText}>🌿</Text>
        </Pressable>
        <Pressable
          style={styles.roundButton}
          onPress={() => setTreasuresOpen(true)}
          hitSlop={10}
        >
          <Text style={styles.zenText}>🎁</Text>
          {collected > 0 && (
            <View style={styles.count}>
              <Text style={styles.countText}>{collected}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {treasuresOpen && (
        <CollectionModal locale={locale} onClose={() => setTreasuresOpen(false)} />
      )}

      {visitor && (
        <Visitor
          key={visitor.key}
          emoji={visitor.emoji}
          side={visitor.side}
          onDone={() => setVisitor(null)}
        />
      )}

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
  bottomBar: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  roundButton: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    shadowColor: colors.forest,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  zenText: { fontSize: 20 },
  count: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.forest,
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: 'center',
  },
  countText: { color: colors.surface, fontSize: 11, fontWeight: '700' },
});
