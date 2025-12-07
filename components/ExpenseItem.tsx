import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Expense } from '../types';

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({ pathname: '/modal', params: { id: expense.id } });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{expense.title}</Text>
      <Text style={styles.details}>${expense.amount} - {expense.category}</Text>
      <Text style={styles.date}>{new Date(expense.date).toLocaleDateString()}</Text>
      {expense.notes && <Text style={styles.notes}>{expense.notes}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#f9f9f9' },
  title: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 14, color: '#666' },
  date: { fontSize: 12, color: '#999' },
  notes: { fontSize: 12, color: '#999', marginTop: 5 },
});