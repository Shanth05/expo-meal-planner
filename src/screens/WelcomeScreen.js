import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '../constants/theme';

const FEATURES = [
  { icon: '🥗', label: 'Recipe Library', desc: 'Filter by meal type, diet, cook time & budget' },
  { icon: '📅', label: 'Weekly Planner', desc: 'Assign meals to each day of the week' },
  { icon: '🛒', label: 'Shopping List', desc: 'Auto-built from your weekly meal plan' },
  { icon: '🥫', label: 'Pantry Tracker', desc: 'Mark ingredients you already have at home' },
];

export function WelcomeScreen({ onGetStarted }) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>STUDENT MEAL PLANNER</Text>
      </View>

      <Text style={styles.appName}>LectureFuel</Text>
      <Text style={styles.tagline}>
        Plan your week, browse recipes, and get a smart shopping list — built for students.
      </Text>

      <View style={styles.featureList}>
        {FEATURES.map((f) => (
          <View key={f.label} style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIconText}>{f.icon}</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onGetStarted}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Text style={styles.ctaText}>Get Started  →</Text>
      </Pressable>

      <Text style={styles.hint}>Your data is saved automatically between sessions</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
  glowTop: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.sun,
    opacity: 0.4,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.sky,
    opacity: 0.6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.forest,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.lg,
  },
  badgeText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
  },
  appName: {
    color: colors.forest,
    fontFamily: fonts.heading,
    fontSize: 44,
    lineHeight: 50,
    marginBottom: spacing.md,
  },
  tagline: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: spacing.xxl,
  },
  featureList: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  featureIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: {
    fontSize: 22,
  },
  featureInfo: {
    flex: 1,
  },
  featureLabel: {
    color: colors.forest,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  featureDesc: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  cta: {
    backgroundColor: colors.forest,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  ctaPressed: {
    opacity: 0.82,
  },
  ctaText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  hint: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
