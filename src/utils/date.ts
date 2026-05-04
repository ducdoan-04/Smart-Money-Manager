import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
  getMonth,
  getYear,
} from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date for display in transaction list
 * Today => "Hôm nay"
 * Yesterday => "Hôm qua"
 * Other => "15 tháng 3, 2025"
 */
export const formatTransactionDate = (isoString: string): string => {
  const date = parseISO(isoString);
  if (isToday(date)) return 'Hôm nay';
  if (isYesterday(date)) return 'Hôm qua';
  return format(date, "d 'tháng' M, yyyy", { locale: vi });
};

/**
 * Format date as short string: "15/03"
 */
export const formatShortDate = (isoString: string): string => {
  return format(parseISO(isoString), 'dd/MM');
};

/**
 * Format month for display: "Tháng 3, 2025"
 */
export const formatMonth = (isoString: string): string => {
  return format(parseISO(isoString), "'Tháng' M, yyyy", { locale: vi });
};

/**
 * Get "YYYY-MM" key for current month
 */
export const getCurrentMonthKey = (): string => {
  return format(new Date(), 'yyyy-MM');
};

/**
 * Get start and end of a month given "YYYY-MM"
 */
export const getMonthRange = (monthKey: string): { start: Date; end: Date } => {
  const date = parseISO(`${monthKey}-01`);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

/**
 * Check if an ISO date string falls in a given month "YYYY-MM"
 */
export const isInMonth = (isoString: string, monthKey: string): boolean => {
  const date = parseISO(isoString);
  const { start, end } = getMonthRange(monthKey);
  return isWithinInterval(date, { start, end });
};

/**
 * Get last N month keys, most recent first
 */
export const getLastNMonthKeys = (n: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = subMonths(new Date(), i);
    result.push(format(d, 'yyyy-MM'));
  }
  return result;
};

/**
 * Relative time: "3 phút trước"
 */
export const timeAgo = (isoString: string): string => {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true, locale: vi });
};
