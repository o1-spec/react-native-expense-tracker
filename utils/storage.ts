import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types';

const EXPENSES_KEY = 'expenses';

export const loadExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await AsyncStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const saveExpenses = async (expenses: Expense[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};

export const addExpense = async (expense: Expense): Promise<void> => {
  const expenses = await loadExpenses();
  expenses.push(expense);
  await saveExpenses(expenses);
};

export const updateExpense = async (updatedExpense: Expense): Promise<void> => {
  const expenses = await loadExpenses();
  const index = expenses.findIndex((e) => e.id === updatedExpense.id);
  if (index !== -1) {
    expenses[index] = updatedExpense;
    await saveExpenses(expenses);
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  const expenses = await loadExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  await saveExpenses(filtered);
};