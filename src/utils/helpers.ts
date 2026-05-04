/**
 * Generate a unique ID using timestamp + random
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Calculate percentage, safe against division by zero
 */
export const safePercent = (value: number, total: number): number => {
  if (total === 0) return 0;
  return clamp((value / total) * 100, 0, 100);
};

/**
 * Group an array by a key function
 */
export const groupBy = <T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> => {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Sum an array of numbers by a key function
 */
export const sumBy = <T>(arr: T[], fn: (item: T) => number): number =>
  arr.reduce((acc, item) => acc + fn(item), 0);

/**
 * Debounce a function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};
