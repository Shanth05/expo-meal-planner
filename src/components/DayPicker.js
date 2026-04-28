import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { dayPickerStyles as styles } from '../styles';

export function DayPicker({ completedDays, onToggle, planByDay, recipeId }) {
  return (
    <View style={styles.container}>
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
        const selected = planByDay[day] === recipeId;
        const completed = completedDays[day] && selected;
        return (
          <Pressable
            key={day}
            onPress={() => onToggle(day)}
            style={[styles.chip, selected && styles.chipSelected, completed && styles.chipCompleted]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{day.slice(0, 3)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

