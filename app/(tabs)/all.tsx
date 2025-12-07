import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryFilter from '../../components/CategoryFilter'; // Add this import
import ExpenseItem from '../../components/ExpenseItem';
import { useExpenses } from '../../hooks/useExpenses';
import { Category } from '../../types';

export default function AllExpenses() {
  const { allExpenses, loading, monthlyTotal } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const router = useRouter();

  const filteredExpenses = selectedCategory === 'All' 
    ? allExpenses 
    : allExpenses.filter((e) => e.category === selectedCategory);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      <Text style={styles.total}>Monthly Total: ${monthlyTotal.toFixed(2)}</Text>
      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} /> {/* Add this */}
      <FlatList
        data={filteredExpenses} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        ListEmptyComponent={<Text>No expenses in this category.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/modal')}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  total: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 10 },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontSize: 16 },
});