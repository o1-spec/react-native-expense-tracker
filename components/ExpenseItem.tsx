import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Expense } from "../types";

interface ExpenseItemProps {
  expense: Expense;
  onDelete?: (id: string) => void;
}

export default function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        "Delete Expense",
        `Are you sure you want to delete "${expense.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(expense.id),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.amount}>
          ₦{(expense.amount || 0).toFixed(2)}
        </Text>
        {/* Add fallback */}
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.date}>
          {new Date(expense.date).toLocaleDateString()}
        </Text>
        {expense.notes && <Text style={styles.notes}>{expense.notes}</Text>}
      </View>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  notes: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
});
