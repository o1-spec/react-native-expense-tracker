import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Change to View for flex row
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const categories: (Category | 'All')[] = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Subscriptions', 'Others'];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.button, selectedCategory === category && styles.selectedButton]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[styles.text, selectedCategory === category && styles.selectedText]}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }, // Flex row with wrap
  button: { paddingVertical: 10, paddingHorizontal: 15, margin: 5, borderRadius: 20, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  selectedButton: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  text: { fontSize: 14, color: '#333', fontWeight: '500' },
  selectedText: { color: 'white', fontWeight: 'bold' },
});