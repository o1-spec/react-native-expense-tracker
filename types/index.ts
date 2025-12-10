export interface Expense {
  id: string;
  title: string;          
  description?: string;  
  amount: number;
  category: Category;
  date: string; 
  notes?: string;
}

export type Category =
  | 'Food'
  | 'Transport'
  | 'Bills'
  | 'Shopping'
  | 'Subscriptions'
  | 'Others';

export interface ExpenseFilters {
  category?: Category;
  startDate?: string;
  endDate?: string;
}