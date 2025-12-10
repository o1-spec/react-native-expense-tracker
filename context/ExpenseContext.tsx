import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Expense } from '../types';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  expenses: Expense[];
  recentExpenses: Expense[];
  allExpenses: Expense[];
  loading: boolean;
  monthlyTotal: number;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (updatedExpense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expensesData: Expense[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          expensesData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            amount: data.amount,
            category: data.category,
            date: data.date.toDate().toISOString(),
            notes: data.notes,
          });
        });
        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const recentExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return expenseDate >= sevenDaysAgo;
  });

  const allExpenses = expenses;

  const monthlyTotal = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) throw new Error('User must be logged in to add expenses');

    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    await addDoc(expensesRef, {
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount,
      category: expense.category,
      date: Timestamp.fromDate(new Date(expense.date)),
      notes: expense.notes || '',
    });
  };

  const updateExpense = async (updatedExpense: Expense) => {
    if (!user) throw new Error('User must be logged in to update expenses');

    const expenseRef = doc(db, 'users', user.uid, 'expenses', updatedExpense.id);
    await updateDoc(expenseRef, {
      title: updatedExpense.title,
      description: updatedExpense.description || '',
      amount: updatedExpense.amount,
      category: updatedExpense.category,
      date: Timestamp.fromDate(new Date(updatedExpense.date)),
      notes: updatedExpense.notes || '',
    });
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error('User must be logged in to delete expenses');

    const expenseRef = doc(db, 'users', user.uid, 'expenses', id);
    await deleteDoc(expenseRef);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        recentExpenses,
        allExpenses,
        loading,
        monthlyTotal,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
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