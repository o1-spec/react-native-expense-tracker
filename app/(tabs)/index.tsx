import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Add ScrollView
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>  {/* Add ScrollView */}
        <Text style={styles.title}>Recent Expenses (Last 7 Days)</Text>
        <Text style={styles.total}>Monthly Total: ${monthlyTotal.toFixed(2)}</Text>  {/* Move out of card for flow */}
        <MonthlyChart expenses={expenses} />
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItem expense={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No recent expenses in this category.</Text>}
          scrollEnabled={false}  // Disable FlatList scrolling since ScrollView handles it
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/modal')}>
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },  // Scrollable container
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', textAlign: 'center', marginBottom: 15 },  // Inline with flow
  listContainer: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20 },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 25, alignItems: 'center', marginVertical: 20, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});