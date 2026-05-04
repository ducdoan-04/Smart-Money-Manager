import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, fontSize, fontWeight, borderRadius, gradients, shadow } from '../../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { height: 38, paddingHorizontal: 14 },
    md: { height: 48, paddingHorizontal: 24 },
    lg: { height: 56, paddingHorizontal: 32 },
  };

  const textSizes = {
    sm: fontSize.sm,
    md: fontSize.base,
    lg: fontSize.lg,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            sizeStyles[size],
            isDisabled && styles.disabled,
            shadow.glow,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={palette.white} size="small" />
          ) : (
            <Text style={[styles.textBase, { fontSize: textSizes[size] }, textStyle]}>
              {label}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        sizeStyles[size],
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? palette.primary100 : palette.white}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            variant === 'ghost' && styles.textGhost,
            { fontSize: textSizes[size] },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondary: {
    backgroundColor: palette.glass200,
    borderWidth: 1,
    borderColor: palette.glass300,
  },
  ghost: {
    backgroundColor: palette.transparent,
  },
  danger: {
    backgroundColor: palette.danger100,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  textBase: {
    color: palette.white,
    fontWeight: fontWeight.semiBold,
    letterSpacing: 0.3,
  },
  textGhost: {
    color: palette.primary200,
  },
});
