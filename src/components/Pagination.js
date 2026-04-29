import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { paginationStyles as styles } from '../styles';

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

