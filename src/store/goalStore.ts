import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';
import { generateId, safePercent } from '../utils';

const STORAGE_KEY = '@smm_goals';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;

  loadGoals: () => Promise<void>;
  addGoal: (data: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Omit<Goal, 'id' | 'createdAt'>>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addContribution: (id: string, amount: number) => Promise<void>;

  getGoalProgress: (id: string) => number; // 0-100
}

export const useGoalStore = create<GoalState>()((set, get) => ({
  goals: [],
  isLoading: false,

  loadGoals: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const goals: Goal[] = raw ? JSON.parse(raw) : [];
      set({ goals, isLoading: false });
    } catch (e) {
      console.error('Failed to load goals:', e);
      set({ isLoading: false });
    }
  },

  addGoal: async (data) => {
    const newGoal: Goal = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [...get().goals, newGoal];
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateGoal: async (id, data) => {
    const updated = get().goals.map((g) => (g.id === id ? { ...g, ...data } : g));
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  addContribution: async (id, amount) => {
    const updated = get().goals.map((g) =>
      g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
    );
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getGoalProgress: (id) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return 0;
    return safePercent(goal.currentAmount, goal.targetAmount);
  },
}));
