// ─── Transaction ─────────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'education'
  | 'housing'
  | 'utilities'
  | 'travel'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  title: string;
  note?: string;
  date: string; // ISO string
  createdAt: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────

export interface Budget {
  id: string;
  categoryId: CategoryId;
  limit: number;
  month: string; // "YYYY-MM"
  spent: number;
}

// ─── Goal ─────────────────────────────────────────────────────────────────────

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string
  icon: string;
  color: string;
  createdAt: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light';
export type CurrencyCode = 'USD' | 'VND' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export interface Settings {
  userName: string;
  currency: CurrencyCode;
  themeMode: ThemeMode;
  isOnboarded: boolean;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Setup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type TransactionStackParamList = {
  TransactionList: undefined;
  AddTransaction: { transactionId?: string };
};

export type BudgetStackParamList = {
  BudgetOverview: undefined;
  AddBudget: { budgetId?: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Goals: undefined;
  AddGoal: { goalId?: string };
  Settings: undefined;
};
