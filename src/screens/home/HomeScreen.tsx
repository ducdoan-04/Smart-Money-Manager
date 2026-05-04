import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { palette, fontSize, fontWeight, spacing, borderRadius, gradients } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { useTransactionStore, useSettingsStore } from '../../store';
import { formatCurrency, formatTransactionDate } from '../../utils';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = React.useState(false);

  const { transactions, loadTransactions, getTotalIncome, getTotalExpense, getBalance } =
    useTransactionStore();
  const { currency, userName } = useSettingsStore();

  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const recentTransactions = transactions.slice(0, 5);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.primary100}
          />
        }
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Xin chào{userName ? `, ${userName}` : ''} 👋
            </Text>
            <Text style={styles.subGreeting}>Đây là tổng quan tháng này</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => {}}
          >
            <Ionicons name="notifications-outline" size={22} color={palette.white} />
          </TouchableOpacity>
        </View>

        {/* ── Balance Card ─────────────────────────────── */}
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Số dư tháng này</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance, currency)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Ionicons name="arrow-up-circle" size={18} color={palette.success100} />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.statLabel}>Thu nhập</Text>
                <Text style={styles.statAmount}>{formatCurrency(totalIncome, currency)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceStat}>
              <Ionicons name="arrow-down-circle" size={18} color={palette.danger100} />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.statLabel}>Chi tiêu</Text>
                <Text style={styles.statAmount}>{formatCurrency(totalExpense, currency)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Quick Actions ────────────────────────────── */}
        <View style={styles.quickActions}>
          {[
            { icon: 'add-circle', label: 'Thêm', color: palette.primary100, onPress: () => navigation.navigate('AddTransaction') },
            { icon: 'wallet', label: 'Ngân sách', color: palette.warning100, onPress: () => navigation.navigate('Budget') },
            { icon: 'bar-chart', label: 'Phân tích', color: palette.info100, onPress: () => navigation.navigate('Analytics') },
            { icon: 'flag', label: 'Mục tiêu', color: palette.success100, onPress: () => navigation.navigate('Goals') },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}22` }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recent Transactions ───────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={36} color={palette.gray400} />
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          </GlassCard>
        ) : (
          recentTransactions.map((tx) => (
            <GlassCard key={tx.id} style={styles.txCard}>
              <CategoryIcon categoryId={tx.categoryId} size={44} />
              <View style={styles.txInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>{tx.title}</Text>
                <Text style={styles.txDate}>{formatTransactionDate(tx.date)}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  tx.type === 'income' ? styles.income : styles.expense,
                ]}
              >
                {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
              </Text>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg100,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: palette.white,
  },
  subGreeting: {
    fontSize: fontSize.sm,
    color: palette.gray300,
    marginTop: 2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    backgroundColor: palette.glass200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    marginHorizontal: spacing.base,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginTop: spacing.base,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: fontSize.sm,
    marginBottom: 8,
  },
  balanceAmount: {
    color: palette.white,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.extraBold,
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.xs,
  },
  statAmount: {
    color: palette.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.base,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.base,
    marginTop: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: palette.gray300,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  seeAll: {
    color: palette.primary200,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  emptyCard: {
    marginHorizontal: spacing.base,
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  emptyText: {
    color: palette.gray400,
    fontSize: fontSize.base,
  },
  txCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    color: palette.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  txDate: {
    color: palette.gray400,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  txAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  income: {
    color: palette.success100,
  },
  expense: {
    color: palette.danger100,
  },
});
