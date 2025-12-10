import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Category, Expense } from "../types";

const categories: Category[] = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Subscriptions",
  "Others",
];

interface ExpenseFormProps {
  initialExpense?: Expense;
  onSave: (expense: Omit<Expense, "id">) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  initialExpense,
  onSave,
  onDelete,
  onCancel,
}: ExpenseFormProps) {
  const [title, setTitle] = useState(initialExpense?.title || "");
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || "");
  const [category, setCategory] = useState<Category>(
    initialExpense?.category || "Food"
  );
  const [date, setDate] = useState(
    new Date(initialExpense?.date || new Date())
  );
  const [notes, setNotes] = useState(initialExpense?.notes || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState(
    initialExpense?.description || ""
  );

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert("Error", "Title and amount are required.");
      return;
    }
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString().split("T")[0],
      notes,
      description,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert("Delete Expense", "Are you sure?", [
        { text: "Cancel" },
        { text: "Delete", onPress: onDelete },
      ]);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {initialExpense ? "Edit Expense" : "Add Expense"}
      </Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategoryButton,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>Date: {date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      {initialExpense && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  categoryContainer: { marginBottom: 20, marginTop: 5 },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  categoryScroll: { flexDirection: "row" },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategoryButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: { fontSize: 14, color: "#333", fontWeight: "500" },
  selectedCategoryText: { color: "white", fontWeight: "bold" },
  dateButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  dateText: { fontSize: 16, color: "#333" },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#8E8E93",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
