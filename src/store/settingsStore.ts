import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, ThemeMode, CurrencyCode } from '../types';

const STORAGE_KEY = '@smm_settings';

const DEFAULT_SETTINGS: Settings = {
  userName: '',
  currency: 'VND',
  themeMode: 'dark',
  isOnboarded: false,
};

interface SettingsState extends Settings {
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  saveSettings: (data: Partial<Settings>) => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  setOnboarded: () => Promise<void>;
  resetAll: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...DEFAULT_SETTINGS,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const settings: Settings = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
      set({ ...settings, isLoading: false });
    } catch (e) {
      console.error('Failed to load settings:', e);
      set({ isLoading: false });
    }
  },

  saveSettings: async (data) => {
    const updated = { ...get(), ...data };
    set(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      userName: updated.userName,
      currency: updated.currency,
      themeMode: updated.themeMode,
      isOnboarded: updated.isOnboarded,
    }));
  },

  setUserName: async (name) => get().saveSettings({ userName: name }),
  setCurrency: async (currency) => get().saveSettings({ currency }),
  setTheme: async (mode) => get().saveSettings({ themeMode: mode }),
  setOnboarded: async () => get().saveSettings({ isOnboarded: true }),

  resetAll: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEY,
      '@smm_transactions',
      '@smm_budgets',
      '@smm_goals',
    ]);
    set({ ...DEFAULT_SETTINGS });
  },
}));
