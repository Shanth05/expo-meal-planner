import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '../constants/theme';

export function TabBar({ tabs, activeTab, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, selected && styles.selectedTab]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    ...shadows.soft,
  },
  tab: {
    backgroundColor: 'transparent',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  selectedTab: {
    backgroundColor: colors.accentDark,
    ...shadows.soft,
  },
  label: {
    color: colors.accentDark,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  selectedLabel: {
    color: colors.paper,
  },
});
