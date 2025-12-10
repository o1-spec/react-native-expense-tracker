import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Expense } from "../types";

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseItem({ expense, onPress, onDelete }: ExpenseItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.amount}>₦{(expense.amount || 0).toFixed(2)}</Text>
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.date}>
          {new Date(expense.date).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
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
});