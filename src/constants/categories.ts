import { CategoryId } from '../types';
import { categoryColors } from '../theme/colors';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string; // Ionicons name
  color: string;
  type: 'expense' | 'income' | 'both';
}

export const CATEGORIES: CategoryMeta[] = [
  // Expense categories
  { id: 'food', label: 'Ăn uống', icon: 'restaurant', color: categoryColors.food, type: 'expense' },
  { id: 'transport', label: 'Di chuyển', icon: 'car', color: categoryColors.transport, type: 'expense' },
  { id: 'shopping', label: 'Mua sắm', icon: 'bag-handle', color: categoryColors.shopping, type: 'expense' },
  { id: 'health', label: 'Sức khỏe', icon: 'medkit', color: categoryColors.health, type: 'expense' },
  { id: 'entertainment', label: 'Giải trí', icon: 'game-controller', color: categoryColors.entertainment, type: 'expense' },
  { id: 'education', label: 'Học tập', icon: 'school', color: categoryColors.education, type: 'expense' },
  { id: 'housing', label: 'Nhà ở', icon: 'home', color: categoryColors.housing, type: 'expense' },
  { id: 'utilities', label: 'Tiện ích', icon: 'flash', color: categoryColors.utilities, type: 'expense' },
  { id: 'travel', label: 'Du lịch', icon: 'airplane', color: categoryColors.travel, type: 'expense' },
  // Income categories
  { id: 'salary', label: 'Lương', icon: 'cash', color: categoryColors.salary, type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop', color: categoryColors.freelance, type: 'income' },
  { id: 'investment', label: 'Đầu tư', icon: 'trending-up', color: categoryColors.investment, type: 'income' },
  { id: 'gift', label: 'Quà tặng', icon: 'gift', color: categoryColors.gift, type: 'both' },
  { id: 'other', label: 'Khác', icon: 'ellipsis-horizontal', color: categoryColors.other, type: 'both' },
];

export const getCategoryById = (id: CategoryId): CategoryMeta =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.type === 'expense' || c.type === 'both');
export const INCOME_CATEGORIES = CATEGORIES.filter((c) => c.type === 'income' || c.type === 'both');
