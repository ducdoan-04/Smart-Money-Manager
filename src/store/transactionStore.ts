import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, TransactionType, CategoryId } from '../types';
import { generateId, getCurrentMonthKey, isInMonth, sumBy } from '../utils';

const STORAGE_KEY = '@smm_transactions';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;

  // Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Selectors (derived)
  getMonthlyTransactions: (monthKey?: string) => Transaction[];
  getTotalIncome: (monthKey?: string) => number;
  getTotalExpense: (monthKey?: string) => number;
  getBalance: (monthKey?: string) => number;
  getTransactionsByCategory: (monthKey?: string) => Record<string, { total: number; count: number }>;
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  isLoading: false,

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = raw ? JSON.parse(raw) : [];
      set({ transactions, isLoading: false });
    } catch (e) {
      console.error('Failed to load transactions:', e);
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    const newTransaction: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTransaction, ...get().transactions];
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateTransaction: async (id, data) => {
    const updated = get().transactions.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteTransaction: async (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getMonthlyTransactions: (monthKey) => {
    const key = monthKey ?? getCurrentMonthKey();
    return get().transactions.filter((t) => isInMonth(t.date, key));
  },

  getTotalIncome: (monthKey) => {
    const txs = get().getMonthlyTransactions(monthKey);
    return sumBy(
      txs.filter((t) => t.type === 'income'),
      (t) => t.amount
    );
  },

  getTotalExpense: (monthKey) => {
    const txs = get().getMonthlyTransactions(monthKey);
    return sumBy(
      txs.filter((t) => t.type === 'expense'),
      (t) => t.amount
    );
  },

  getBalance: (monthKey) => {
    return get().getTotalIncome(monthKey) - get().getTotalExpense(monthKey);
  },

  getTransactionsByCategory: (monthKey) => {
    const txs = get().getMonthlyTransactions(monthKey).filter((t) => t.type === 'expense');
    const result: Record<string, { total: number; count: number }> = {};
    txs.forEach((t) => {
      if (!result[t.categoryId]) {
        result[t.categoryId] = { total: 0, count: 0 };
      }
      result[t.categoryId].total += t.amount;
      result[t.categoryId].count += 1;
    });
    return result;
  },
}));
