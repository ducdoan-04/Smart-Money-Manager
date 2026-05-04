import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { palette, fontSize, fontWeight, spacing, borderRadius, gradients } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useSettingsStore } from '../../store';
import { CURRENCIES } from '../../constants';
import { CurrencyCode } from '../../types';

export const SetupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setUserName, setCurrency, setOnboarded } = useSettingsStore();

  const [name, setName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('VND');
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    setIsLoading(true);
    await setUserName(name.trim() || 'Người dùng');
    await setCurrency(selectedCurrency);
    await setOnboarded();
    setIsLoading(false);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Thiết lập ban đầu</Text>
        <Text style={styles.subtitle}>Chỉ mất 1 phút để bắt đầu</Text>

        {/* Name */}
        <GlassCard style={styles.card}>
          <Text style={styles.label}>Tên của bạn</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="VD: Nguyễn Văn A"
            placeholderTextColor={palette.gray500}
            autoCapitalize="words"
          />
        </GlassCard>

        {/* Currency Picker */}
        <Text style={styles.sectionTitle}>Chọn đơn vị tiền tệ</Text>
        <View style={styles.currencyGrid}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[
                styles.currencyItem,
                selectedCurrency === c.code && styles.currencyItemActive,
              ]}
              onPress={() => setSelectedCurrency(c.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.currencySymbol}>{c.symbol}</Text>
              <Text style={styles.currencyCode}>{c.code}</Text>
              <Text style={styles.currencyName} numberOfLines={1}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Bắt đầu"
          onPress={handleFinish}
          loading={isLoading}
          size="lg"
          fullWidth
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg100 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: 40 },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extraBold,
    color: palette.white,
    marginTop: spacing.lg,
  },
  subtitle: { color: palette.gray400, fontSize: fontSize.base },
  card: { gap: spacing.sm },
  label: { color: palette.gray400, fontSize: fontSize.sm },
  input: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    borderBottomWidth: 1,
    borderBottomColor: palette.glass300,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semiBold,
    marginTop: spacing.md,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  currencyItem: {
    width: '30%',
    backgroundColor: palette.glass200,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 2,
  },
  currencyItemActive: {
    borderColor: palette.primary100,
    backgroundColor: `${palette.primary100}22`,
  },
  currencySymbol: { color: palette.white, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  currencyCode: { color: palette.primary200, fontSize: fontSize.sm, fontWeight: fontWeight.semiBold },
  currencyName: { color: palette.gray400, fontSize: fontSize.xs, textAlign: 'center' },
  btn: { marginTop: spacing.md },
});
