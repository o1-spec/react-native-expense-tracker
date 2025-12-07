import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CategoryFilter from '../../components/CategoryFilter';
import ExpenseItem from '../../components/ExpenseItem';
import MonthlyChart from '../../components/MonthlyChart';
import { useExpenses } from '../../hooks/useExpenses';
import { Category } from '../../types';

export default function AllExpenses() {
  const { allExpenses, loading, monthlyTotal, expenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState(''); 
  const router = useRouter();

  const filteredExpenses = allExpenses
    .filter((e) => selectedCategory === 'All' || e.category === selectedCategory)
    .filter((e) => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    ); 

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
      <MonthlyChart expenses={expenses} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      /> {/* Add search bar */}
      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        ListEmptyComponent={<Text>No expenses match your search.</Text>}
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
  searchInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }, // Add style
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontSize: 16 },
});