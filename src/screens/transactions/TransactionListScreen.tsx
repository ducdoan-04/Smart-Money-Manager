import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { palette, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useTransactionStore, useSettingsStore } from '../../store';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatTransactionDate } from '../../utils';

type FilterType = 'all' | 'income' | 'expense';

export const TransactionListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>('all');

  const { transactions, loadTransactions } = useTransactionStore();
  const { currency } = useSettingsStore();

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AddTransaction', { transactionId: item.id })}
    >
      <GlassCard style={styles.txCard}>
        <CategoryIcon categoryId={item.categoryId} size={44} />
        <View style={styles.txInfo}>
          <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.txDate}>{formatTransactionDate(item.date)}</Text>
        </View>
        <Text style={[styles.txAmount, item.type === 'income' ? styles.income : styles.expense]}>
          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount, currency)}
        </Text>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Giao dịch"
        rightElement={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddTransaction', {})}
          >
            <Ionicons name="add" size={22} color={palette.white} />
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tất cả' : f === 'income' ? 'Thu nhập' : 'Chi tiêu'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={palette.gray500} />
            <Text style={styles.emptyText}>Chưa có giao dịch</Text>
          </View>
        }
      />
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
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    backgroundColor: palette.bg300,
    borderRadius: borderRadius.xl,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  filterTabActive: {
    backgroundColor: palette.primary100,
  },
  filterText: {
    color: palette.gray400,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: palette.white,
    fontWeight: fontWeight.semiBold,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
    gap: spacing.sm,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  txInfo: { flex: 1 },
  txTitle: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.medium },
  txDate: { color: palette.gray400, fontSize: fontSize.xs, marginTop: 2 },
  txAmount: { fontSize: fontSize.md, fontWeight: fontWeight.semiBold },
  income: { color: palette.success100 },
  expense: { color: palette.danger100 },
  emptyContainer: { alignItems: 'center', marginTop: 80, gap: spacing.md },
  emptyText: { color: palette.gray500, fontSize: fontSize.base },
});
