import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { palette, borderRadius, shadow } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 16,
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.glass200,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: palette.glass300,
  },
  elevated: {
    backgroundColor: palette.bg300,
    ...shadow.md,
  },
  outlined: {
    backgroundColor: palette.transparent,
    borderColor: palette.primary100,
    borderWidth: 1.5,
  },
});
