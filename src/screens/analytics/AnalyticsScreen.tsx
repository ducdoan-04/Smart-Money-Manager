import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { useTransactionStore, useSettingsStore } from '../../store';
import { formatCurrency, getCurrentMonthKey, getLastNMonthKeys, safePercent } from '../../utils';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../constants';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const { loadTransactions, getTransactionsByCategory, getTotalExpense, getMonthlyTransactions } =
    useTransactionStore();
  const { currency } = useSettingsStore();

  const monthKey = getCurrentMonthKey();
  const totalExpense = getTotalExpense(monthKey);
  const byCategory = getTransactionsByCategory(monthKey);

  const categoryBreakdown = Object.entries(byCategory)
    .map(([catId, data]) => ({
      catId: catId as CategoryId,
      total: data.total,
      count: data.count,
      percent: safePercent(data.total, totalExpense),
    }))
    .sort((a, b) => b.total - a.total);

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Phân tích" subtitle={monthKey} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Expense Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng chi tiêu tháng này</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalExpense, currency)}</Text>
        </GlassCard>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Chi tiêu theo danh mục</Text>

        {categoryBreakdown.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có dữ liệu chi tiêu</Text>
          </GlassCard>
        ) : (
          categoryBreakdown.map((item) => {
            const meta = CATEGORIES.find((c) => c.id === item.catId);
            return (
              <GlassCard key={item.catId} style={styles.catCard}>
                <View style={styles.catRow}>
                  <CategoryIcon categoryId={item.catId} size={40} />
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{meta?.label ?? item.catId}</Text>
                    <Text style={styles.catCount}>{item.count} giao dịch</Text>
                  </View>
                  <View style={styles.catRight}>
                    <Text style={styles.catAmount}>{formatCurrency(item.total, currency)}</Text>
                    <Text style={styles.catPercent}>{Math.round(item.percent)}%</Text>
                  </View>
                </View>
                {/* Mini progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.percent}%`,
                        backgroundColor: meta?.color ?? palette.primary100,
                      },
                    ]}
                  />
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg100 },
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 100 },
  summaryCard: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  summaryLabel: { color: palette.gray300, fontSize: fontSize.sm },
  summaryAmount: { color: palette.white, fontSize: fontSize['4xl'], fontWeight: fontWeight.extraBold },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
  },
  emptyCard: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  emptyText: { color: palette.gray400, fontSize: fontSize.base },
  catCard: { gap: spacing.md },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  catInfo: { flex: 1 },
  catName: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.semiBold },
  catCount: { color: palette.gray400, fontSize: fontSize.xs, marginTop: 2 },
  catRight: { alignItems: 'flex-end' },
  catAmount: { color: palette.white, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  catPercent: { color: palette.gray400, fontSize: fontSize.xs },
  progressTrack: {
    height: 6,
    backgroundColor: palette.bg400,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
