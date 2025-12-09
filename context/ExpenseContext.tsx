import React, { createContext, useContext, useEffect, useState } from 'react';
import { Expense } from '../types';
import { addExpense as addToStorage, deleteExpense as deleteFromStorage, loadExpenses, updateExpense as updateInStorage } from '../utils/storage';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (updatedExpense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  recentExpenses: Expense[];
  allExpenses: Expense[];
  monthlyTotal: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return (
    <ExpenseContext.Provider value={{
      expenses,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      recentExpenses,
      allExpenses,
      monthlyTotal,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};