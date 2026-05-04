import { CurrencyCode } from '../types';
import { getCurrencyByCode } from '../constants/currencies';

/**
 * Format a number as currency string
 * e.g. formatCurrency(50000, 'VND') => '50.000 ₫'
 */
export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'VND'): string => {
  const meta = getCurrencyByCode(currencyCode);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'VND' || currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'VND' || currencyCode === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toLocaleString()}`;
  }
};

/**
 * Compact format for large numbers
 * e.g. 1500000 => '1.5M'
 */
export const formatCompact = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toString();
};

/**
 * Parse raw input string to number
 */
export const parseAmount = (raw: string): number => {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};
