import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { palette, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useBudgetStore, useTransactionStore, useSettingsStore } from '../../store';
import { formatCurrency, safePercent, getCurrentMonthKey } from '../../utils';

export const BudgetScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { budgets, loadBudgets } = useBudgetStore();
  const { getTransactionsByCategory } = useTransactionStore();
  const { currency } = useSettingsStore();

  const monthKey = getCurrentMonthKey();
  const monthlyBudgets = budgets.filter((b) => b.month === monthKey);
  const spendingByCategory = getTransactionsByCategory(monthKey);

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Ngân sách"
        rightElement={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddBudget', {})}
          >
            <Ionicons name="add" size={22} color={palette.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {monthlyBudgets.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="wallet-outline" size={48} color={palette.gray500} />
            <Text style={styles.emptyTitle}>Chưa có ngân sách</Text>
            <Text style={styles.emptyText}>Tạo ngân sách để kiểm soát chi tiêu</Text>
          </GlassCard>
        ) : (
          monthlyBudgets.map((budget) => {
            const spent = spendingByCategory[budget.categoryId]?.total ?? 0;
            const progress = safePercent(spent, budget.limit);
            const isOver = spent > budget.limit;

            return (
              <TouchableOpacity
                key={budget.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AddBudget', { budgetId: budget.id })}
              >
                <GlassCard style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <CategoryIcon categoryId={budget.categoryId} size={40} />
                    <View style={styles.budgetInfo}>
                      <Text style={styles.budgetCategory}>
                        {budget.categoryId}
                      </Text>
                      <Text style={[styles.budgetStatus, isOver && styles.overBudget]}>
                        {formatCurrency(spent, currency)} / {formatCurrency(budget.limit, currency)}
                      </Text>
                    </View>
                    <Text style={[styles.budgetPercent, isOver && styles.overBudget]}>
                      {Math.round(progress)}%
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: isOver ? palette.danger100 : palette.primary100,
                        },
                      ]}
                    />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg100 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: palette.primary100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 100 },
  emptyCard: { alignItems: 'center', paddingVertical: spacing['3xl'], gap: spacing.md },
  emptyTitle: { color: palette.white, fontSize: fontSize.lg, fontWeight: fontWeight.semiBold },
  emptyText: { color: palette.gray400, fontSize: fontSize.sm, textAlign: 'center' },
  budgetCard: { gap: spacing.md },
  budgetHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  budgetInfo: { flex: 1 },
  budgetCategory: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.semiBold, textTransform: 'capitalize' },
  budgetStatus: { color: palette.gray400, fontSize: fontSize.sm, marginTop: 2 },
  budgetPercent: { color: palette.primary200, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  overBudget: { color: palette.danger100 },
  progressTrack: {
    height: 8,
    backgroundColor: palette.bg400,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
