import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, CategoryId } from '../types';
import { generateId, getCurrentMonthKey, safePercent } from '../utils';

const STORAGE_KEY = '@smm_budgets';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;

  // Actions
  loadBudgets: () => Promise<void>;
  addBudget: (data: Omit<Budget, 'id' | 'spent'>) => Promise<void>;
  updateBudget: (id: string, data: Partial<Omit<Budget, 'id'>>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  updateSpent: (categoryId: CategoryId, month: string, spent: number) => void;

  // Selectors
  getMonthlyBudgets: (monthKey?: string) => Budget[];
  getBudgetProgress: (id: string) => number; // 0-100
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  budgets: [],
  isLoading: false,

  loadBudgets: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const budgets: Budget[] = raw ? JSON.parse(raw) : [];
      set({ budgets, isLoading: false });
    } catch (e) {
      console.error('Failed to load budgets:', e);
      set({ isLoading: false });
    }
  },

  addBudget: async (data) => {
    const newBudget: Budget = { ...data, id: generateId(), spent: 0 };
    const updated = [...get().budgets, newBudget];
    set({ budgets: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateBudget: async (id, data) => {
    const updated = get().budgets.map((b) => (b.id === id ? { ...b, ...data } : b));
    set({ budgets: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteBudget: async (id) => {
    const updated = get().budgets.filter((b) => b.id !== id);
    set({ budgets: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateSpent: (categoryId, month, spent) => {
    const updated = get().budgets.map((b) =>
      b.categoryId === categoryId && b.month === month ? { ...b, spent } : b
    );
    set({ budgets: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getMonthlyBudgets: (monthKey) => {
    const key = monthKey ?? getCurrentMonthKey();
    return get().budgets.filter((b) => b.month === key);
  },

  getBudgetProgress: (id) => {
    const budget = get().budgets.find((b) => b.id === id);
    if (!budget) return 0;
    return safePercent(budget.spent, budget.limit);
  },
}));
