import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const categories: (Category | 'All')[] = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Subscriptions', 'Others'];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.button, selectedCategory === category && styles.selectedButton]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[styles.text, selectedCategory === category && styles.selectedText]}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  button: { padding: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#f0f0f0' },
  selectedButton: { backgroundColor: '#007AFF' },
  text: { fontSize: 14, color: '#333' },
  selectedText: { color: 'white' },
});