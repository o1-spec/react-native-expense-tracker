import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Add this import
import { Picker } from '@react-native-picker/picker';
import { Category, Expense } from '../types';

const categories: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Subscriptions', 'Others'];

interface ExpenseFormProps {
  initialExpense?: Expense;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initialExpense, onSave, onDelete, onCancel }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialExpense?.title || '');
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || '');
  const [category, setCategory] = useState<Category>(initialExpense?.category || 'Food');
  const [date, setDate] = useState(new Date(initialExpense?.date || new Date())); // Use Date object
  const [notes, setNotes] = useState(initialExpense?.notes || '');
  const [showDatePicker, setShowDatePicker] = useState(false); // Add state for picker visibility

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Title and amount are required.');
      return;
    }
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
      notes,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert('Delete Expense', 'Are you sure?', [
        { text: 'Cancel' },
        { text: 'Delete', onPress: onDelete },
      ]);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Hide on Android after selection
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{initialExpense ? 'Edit Expense' : 'Add Expense'}</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
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
      <TextInput style={styles.input} placeholder="Notes" value={notes} onChangeText={setNotes} multiline />
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
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  pickerContainer: { marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  dateButton: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#f9f9f9' },
  dateText: { fontSize: 16 },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  deleteButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  cancelButton: { backgroundColor: '#8E8E93', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
});