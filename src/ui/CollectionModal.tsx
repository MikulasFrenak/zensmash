/**
 * Treasure window — everything freed from the cubes, with counts.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCollection } from '@/state/collection';
import { UI } from '@/locales/ui';
import { Locale } from '@/locales/moments';
import { colors } from '@/theme/colors';

interface Props {
  locale: Locale;
  onClose: () => void;
}

export function CollectionModal({ locale, onClose }: Props) {
  const collection = useCollection();
  const t = UI[locale];
  const items = [...collection.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>{t.collectionTitle}</Text>

        {items.length === 0 ? (
          <Text style={styles.empty}>{t.collectionEmpty}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.grid} style={styles.scroll}>
            {items.map(([emoji, count]) => (
              <View key={emoji} style={styles.item}>
                <Text style={styles.emoji}>{emoji}</Text>
                {count > 1 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>×{count}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{t.keepSmashing}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 75, 60, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  card: {
    width: '88%',
    maxWidth: 380,
    maxHeight: 460,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 18,
  },
  scroll: { alignSelf: 'stretch' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  item: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  emoji: { fontSize: 28 },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: colors.forest,
    borderRadius: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: colors.surface, fontSize: 10, fontWeight: '700' },
  button: {
    marginTop: 14,
    backgroundColor: colors.sage,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
});
