import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryFilter from '../../components/CategoryFilter';
import ExpenseItem from '../../components/ExpenseItem';
import MonthlyChart from '../../components/MonthlyChart';
import { useExpenses } from '../../hooks/useExpenses';
import { Category } from '../../types';

export default function RecentExpenses() {
  const { recentExpenses, loading, monthlyTotal, expenses,deleteExpense } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const router = useRouter();

  const filteredExpenses = selectedCategory === 'All' 
    ? recentExpenses 
    : recentExpenses.filter((e) => e.category === selectedCategory);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Ionicons name="hourglass-outline" size={48} color="#3B82F6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Recent Expenses</Text>
          <Text style={styles.subtitle}>Last 7 Days</Text>
        </View>

        {/* Monthly Total Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalContent}>
            <Text style={styles.totalLabel}>Monthly Total</Text>
            <Text style={styles.totalAmount}>₦{monthlyTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalBadge}>
            <Ionicons name="wallet" size={20} color="#3B82F6" />
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category</Text>
          <View style={styles.chartWrapper}>
            <MonthlyChart expenses={expenses} />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </View>

        {/* Expenses List */}
        <View style={styles.expensesSection}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExpenseItem expense={item} onDelete={deleteExpense} />} // Add onDelete prop
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={56} color="#D1D5DB" />
                <Text style={styles.emptyText}>No expenses found</Text>
              </View>
            }
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('/modal')} 
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 32 
  },
  
  // Header
  headerSection: {
    marginBottom: 28,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 6 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontWeight: '500' 
  },

  // Total Card
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  totalContent: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
  },
  totalBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chart Card
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter Section
  filterSection: {
    marginBottom: 24,
  },

  // Expenses Section
  expensesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  listContainer: { 
    paddingBottom: 8 
  },

  // Empty State
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: { 
    fontSize: 15, 
    color: '#9CA3AF', 
    fontWeight: '500',
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Utilities
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '500',
  },
});