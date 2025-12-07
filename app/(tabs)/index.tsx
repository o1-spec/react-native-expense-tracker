import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Add SafeAreaView
import CategoryFilter from '../../components/CategoryFilter';
import ExpenseItem from '../../components/ExpenseItem';
import MonthlyChart from '../../components/MonthlyChart';
import { useExpenses } from '../../hooks/useExpenses';
import { Category } from '../../types';

export default function RecentExpenses() {
  const { recentExpenses, loading, monthlyTotal, expenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const router = useRouter();

  const filteredExpenses = selectedCategory === 'All' 
    ? recentExpenses 
    : recentExpenses.filter((e) => e.category === selectedCategory);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Recent Expenses (Last 7 Days)</Text>
        <View style={styles.card}>
          <Text style={styles.total}>Monthly Total: ${monthlyTotal.toFixed(2)}</Text>
          <MonthlyChart expenses={expenses} />
        </View>
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItem expense={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No recent expenses in this category.</Text>}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/modal')}>
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20 },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 25, alignItems: 'center', marginVertical: 20, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});