import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';

import { palette, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { useTransactionStore, useSettingsStore } from '../../store';
import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants';
import { CategoryId, TransactionType } from '../../types';
import { formatCurrency, parseAmount, generateId } from '../../utils';

type RouteParams = {
  AddTransaction: { transactionId?: string };
};

export const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'AddTransaction'>>();
  const { transactionId } = route.params ?? {};
  const isEdit = !!transactionId;

  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();
  const { currency } = useSettingsStore();

  const existingTx = transactions.find((t) => t.id === transactionId);

  const [type, setType] = useState<TransactionType>(existingTx?.type ?? 'expense');
  const [amount, setAmount] = useState(existingTx ? existingTx.amount.toString() : '');
  const [title, setTitle] = useState(existingTx?.title ?? '');
  const [note, setNote] = useState(existingTx?.note ?? '');
  const [categoryId, setCategoryId] = useState<CategoryId>(existingTx?.categoryId ?? 'food');
  const [date, setDate] = useState(existingTx?.date ?? new Date().toISOString());
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = async () => {
    if (!amount || !title) return;
    setIsLoading(true);
    const data = {
      type,
      amount: parseAmount(amount),
      title: title.trim(),
      note: note.trim() || undefined,
      categoryId,
      date,
    };
    if (isEdit && transactionId) {
      await updateTransaction(transactionId, data);
    } else {
      await addTransaction(data);
    }
    setIsLoading(false);
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (transactionId) {
      await deleteTransaction(transactionId);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title={isEdit ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        showBack
        onBack={() => navigation.goBack()}
        rightElement={
          isEdit ? (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color={palette.danger100} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.typeRow}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeTab, type === t && (t === 'income' ? styles.incomeTab : styles.expenseTab)]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>
                {t === 'income' ? 'Thu nhập' : 'Chi tiêu'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <GlassCard style={styles.amountCard}>
          <Text style={styles.fieldLabel}>Số tiền</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>{currency === 'VND' ? '₫' : '$'}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={palette.gray500}
            />
          </View>
        </GlassCard>

        {/* Title */}
        <GlassCard style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Tiêu đề</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="VD: Ăn trưa, Tiền lương..."
            placeholderTextColor={palette.gray500}
          />
        </GlassCard>

        {/* Category Picker */}
        <TouchableOpacity onPress={() => setShowCategoryPicker(true)}>
          <GlassCard style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Danh mục</Text>
            <View style={styles.categoryRow}>
              <CategoryIcon categoryId={categoryId} size={32} />
              <Text style={styles.categoryLabel}>
                {CATEGORIES.find((c) => c.id === categoryId)?.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={palette.gray400} style={{ marginLeft: 'auto' }} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Note */}
        <GlassCard style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Ghi chú (tùy chọn)</Text>
          <TextInput
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="Thêm ghi chú..."
            placeholderTextColor={palette.gray500}
            multiline
            numberOfLines={2}
          />
        </GlassCard>

        <Button
          label={isEdit ? 'Lưu thay đổi' : 'Thêm giao dịch'}
          onPress={handleSave}
          loading={isLoading}
          disabled={!amount || !title}
          fullWidth
          style={styles.saveBtn}
        />
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Ionicons name="close" size={24} color={palette.white} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.catItem, categoryId === item.id && styles.catItemActive]}
                  onPress={() => {
                    setCategoryId(item.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <CategoryIcon categoryId={item.id} size={44} />
                  <Text style={styles.catItemLabel} numberOfLines={1}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg100 },
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 40 },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: `${palette.danger100}22`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    backgroundColor: palette.bg300,
    borderRadius: borderRadius.xl,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  incomeTab: { backgroundColor: palette.success100 },
  expenseTab: { backgroundColor: palette.danger100 },
  typeText: { color: palette.gray400, fontWeight: fontWeight.semiBold, fontSize: fontSize.base },
  typeTextActive: { color: palette.white },
  amountCard: { gap: spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  currencySymbol: { color: palette.primary200, fontSize: fontSize['3xl'], fontWeight: fontWeight.bold },
  amountInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  fieldCard: { gap: spacing.sm },
  fieldLabel: { color: palette.gray400, fontSize: fontSize.sm },
  textInput: { color: palette.white, fontSize: fontSize.base },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  categoryLabel: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.medium },
  saveBtn: { marginTop: spacing.md },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: spacing.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { color: palette.white, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  catItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    margin: 4,
  },
  catItemActive: { backgroundColor: palette.glass300 },
  catItemLabel: { color: palette.gray300, fontSize: fontSize.xs, textAlign: 'center' },
});
