import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { splashStyles as styles } from '../styles';

export function SplashScreen({ onContinue }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Pressable onPress={onContinue} style={styles.container}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      <Animated.View
        style={[styles.logoBox, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🥗</Text>
        </View>
        <Text style={styles.appName}>LectureFuel</Text>
        <Text style={styles.tagline}>Student Meal Planner</Text>
      </Animated.View>

    </Pressable>
  );
}

