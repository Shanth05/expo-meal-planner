import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

export function Pagination({ currentPage, pageCount, onChange }) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        disabled={currentPage === 1}
        onPress={() => onChange(currentPage - 1)}
        style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, currentPage === 1 && styles.buttonTextDisabled]}>Previous</Text>
      </Pressable>
      <Text style={styles.pageLabel}>
        Page {currentPage} of {pageCount}
      </Text>
      <Pressable
        disabled={currentPage === pageCount}
        onPress={() => onChange(currentPage + 1)}
        style={[styles.button, currentPage === pageCount && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, currentPage === pageCount && styles.buttonTextDisabled]}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  buttonText: {
    color: colors.paper,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  buttonTextDisabled: {
    color: colors.muted,
  },
  pageLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
});
