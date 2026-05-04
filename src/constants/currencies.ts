import { CurrencyCode } from '../types';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'VND', symbol: '₫', name: 'Việt Nam Đồng', locale: 'vi-VN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
];

export const getCurrencyByCode = (code: CurrencyCode): CurrencyMeta =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
