import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ExpenseForm from '../components/ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';
import { Expense } from '../types';

export default function ExpenseModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addExpense, updateExpense, deleteExpense, expenses } = useExpenses();

  const [initialExpense, setInitialExpense] = useState<Expense | undefined>();

  useEffect(() => {
    if (params.id) {
      const expense = expenses.find((e) => e.id === params.id);
      setInitialExpense(expense);
    } else {
      setInitialExpense(undefined);
    }
  }, [params.id, expenses]);

  const handleSave = async (expenseData: Omit<Expense, 'id'>) => {
    if (initialExpense) {
      await updateExpense({ ...expenseData, id: initialExpense.id });
    } else {
      await addExpense(expenseData);
    }
    router.back();
  };

  const handleDelete = async () => {
    if (initialExpense) {
      await deleteExpense(initialExpense.id);
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ExpenseForm
        initialExpense={initialExpense}
        onSave={handleSave}
        onDelete={initialExpense ? handleDelete : undefined}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});