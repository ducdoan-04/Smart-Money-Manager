import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, fontSize, fontWeight, borderRadius, spacing } from '../../theme';
import { categoryColors } from '../../theme/colors';
import { getCategoryById } from '../../constants/categories';
import { CategoryId, TransactionType } from '../../types';

interface CategoryIconProps {
  categoryId: CategoryId;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, size = 40 }) => {
  const meta = getCategoryById(categoryId);
  const iconSize = size * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2.5,
          backgroundColor: `${meta.color}22`,
        },
      ]}
    >
      <Ionicons name={meta.icon as any} size={iconSize} color={meta.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
