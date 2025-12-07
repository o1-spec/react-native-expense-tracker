import { useEffect, useState } from 'react';
import { Expense } from '../types';
import { addExpense as addToStorage, deleteExpense as deleteFromStorage, loadExpenses, updateExpense as updateInStorage } from '../utils/storage';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await loadExpenses();
      setExpenses(data);
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    await addToStorage(newExpense);
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = async (updatedExpense: Expense) => {
    await updateInStorage(updatedExpense);
    setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
  };

  const deleteExpense = async (id: string) => {
    await deleteFromStorage(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const recentExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return expenseDate >= sevenDaysAgo;
  });

  const allExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTotal = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    expenses,
    recentExpenses,
    allExpenses,
    monthlyTotal,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};