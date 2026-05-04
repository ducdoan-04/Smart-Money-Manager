// ─── Color Palette ────────────────────────────────────────────────────────────

export const palette = {
  // Backgrounds
  bg100: '#0A0F1E',
  bg200: '#111827',
  bg300: '#1C2433',
  bg400: '#252D3D',

  // Surface / Glass
  glass100: 'rgba(255,255,255,0.04)',
  glass200: 'rgba(255,255,255,0.08)',
  glass300: 'rgba(255,255,255,0.12)',

  // Accent – Violet/Indigo
  primary100: '#6C63FF',
  primary200: '#8B83FF',
  primary300: '#A8A3FF',

  // Success – Green
  success100: '#00D09E',
  success200: '#00F5B5',

  // Danger – Red
  danger100: '#FF4757',
  danger200: '#FF6B77',

  // Warning – Orange
  warning100: '#FFA502',
  warning200: '#FFB732',

  // Info – Blue
  info100: '#1E90FF',
  info200: '#54A8FF',

  // Neutrals
  white: '#FFFFFF',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#ADB5BD',
  gray400: '#6C757D',
  gray500: '#495057',
  gray600: '#343A40',
  gray700: '#212529',
  black: '#000000',

  transparent: 'transparent',
} as const;

// ─── Category Colors ──────────────────────────────────────────────────────────

export const categoryColors: Record<string, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  shopping: '#A855F7',
  health: '#FF4757',
  entertainment: '#FFA502',
  education: '#1E90FF',
  housing: '#2ED573',
  utilities: '#70A1FF',
  travel: '#FF6348',
  salary: '#00D09E',
  freelance: '#26de81',
  investment: '#45B7D1',
  gift: '#FF9FF3',
  other: '#ADB5BD',
};

// ─── Gradient Presets ─────────────────────────────────────────────────────────

export const gradients = {
  primary: ['#6C63FF', '#A855F7'] as const,
  income: ['#00D09E', '#00B88A'] as const,
  expense: ['#FF4757', '#FF6B77'] as const,
  card: ['rgba(108,99,255,0.15)', 'rgba(168,85,247,0.05)'] as const,
  dark: ['#111827', '#0A0F1E'] as const,
  balance: ['#1C2433', '#252D3D'] as const,
};
