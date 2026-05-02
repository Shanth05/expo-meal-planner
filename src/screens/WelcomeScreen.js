import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { welcomeStyles as styles } from '../styles';

const FEATURES = [
  { icon: '🥗', label: 'Recipe Library', desc: 'Filter by meal type, diet, cook time & budget', screen: 'library' },
  { icon: '📅', label: 'Weekly Planner', desc: 'Assign meals to each day of the week', screen: 'plan' },
  { icon: '🛒', label: 'Shopping List', desc: 'Auto-built from your weekly meal plan', screen: 'plan' },
  { icon: '🥫', label: 'Pantry Tracker', desc: 'Mark ingredients you already have at home', screen: 'pantry' },
];

export function WelcomeScreen({ onNavigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>STUDENT MEAL PLANNER</Text>
      </View>

      <Text style={styles.appName}>LectureFuel</Text>
      <Text style={styles.tagline}>
        Plan your week, browse recipes, and get a smart shopping list — built for students.
      </Text>

      <Text style={styles.sectionLabel}>What you can do</Text>
      <View style={styles.featureList}>
        {FEATURES.map((f) => (
          <Pressable
            key={f.label}
            style={({ pressed }) => [styles.featureRow, pressed && styles.featureRowPressed]}
            onPress={() => onNavigate && onNavigate(f.screen)}
          >
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIconText}>{f.icon}</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
            <Text style={styles.featureArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.hint}>Your data is saved automatically between sessions</Text>
    </ScrollView>
  );
}

