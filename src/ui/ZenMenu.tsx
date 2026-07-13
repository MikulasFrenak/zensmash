/**
 * S7 + S8: calm overlay — session summary and settings toggles.
 * No modal chrome, no pressure; one tap to return to smashing.
 */
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { trackSettingChanged } from '@/analytics';
import { setSetting, useSettings } from '@/state/settings';
import { UI } from '@/locales/ui';
import { LOCALES, LOCALE_LABELS, Locale } from '@/locales/moments';
import { colors } from '@/theme/colors';

interface Props {
  broken: number;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  onClose: () => void;
}

export function ZenMenu({ broken, locale, onLocaleChange, onClose }: Props) {
  const settings = useSettings();
  const t = UI[locale];

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>{t.sessionTitle}</Text>
        <Text style={styles.stat}>{broken === 0 ? t.nothingYet : t.blocksBroken(broken)}</Text>
        <Text style={styles.subtitle}>{t.feelLighter}</Text>

        <View style={styles.rows}>
          {(
            [
              [t.sound, 'sound'],
              [t.haptics, 'haptics'],
              [t.particles, 'particles'],
              [t.shareData, 'analytics'],
            ] as const
          ).map(([label, key]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Switch
                value={settings[key]}
                onValueChange={(v) => {
                  setSetting(key, v);
                  trackSettingChanged(key, v);
                }}
                trackColor={{ true: colors.sage, false: '#DDD' }}
                thumbColor={colors.surface}
              />
            </View>
          ))}
        </View>

        <View style={styles.langGrid}>
          {LOCALES.map((l) => (
            <Pressable
              key={l}
              style={[styles.langChip, l === locale && styles.langChipActive]}
              onPress={() => onLocaleChange(l)}
            >
              <Text style={[styles.langChipText, l === locale && styles.langChipTextActive]}>
                {LOCALE_LABELS[l]}
              </Text>
            </Pressable>
          ))}
        </View>

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
  },
  card: {
    width: 300,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  stat: { fontSize: 16, color: colors.textPrimary, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  rows: { alignSelf: 'stretch', gap: 2, marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  rowLabel: { fontSize: 15, color: colors.textPrimary },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  langChip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.mint,
  },
  langChipActive: { backgroundColor: colors.forest },
  langChipText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  langChipTextActive: { color: colors.surface },
  button: {
    backgroundColor: colors.sage,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
});
