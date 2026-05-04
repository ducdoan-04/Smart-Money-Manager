import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { palette, fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useSettingsStore, useGoalStore } from '../../store';
import { formatCurrency, safePercent } from '../../utils';
import { CURRENCIES } from '../../constants';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { userName, currency, themeMode, setTheme, resetAll } = useSettingsStore();
  const { goals } = useGoalStore();

  const isDark = themeMode === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Đăng xuất sẽ xóa toàn bộ dữ liệu thiết bị và đưa bạn về màn hình thiết lập. Bạn có chắc chắn không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => {
            resetAll();
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'flag-outline', label: 'Mục tiêu tiết kiệm', onPress: () => navigation.navigate('Goals') },
    { icon: 'settings-outline', label: 'Cài đặt', onPress: () => navigation.navigate('Settings') },
    { icon: 'download-outline', label: 'Xuất dữ liệu', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Trợ giúp', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Hồ sơ" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName ? userName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{userName || 'Người dùng'}</Text>
          <Text style={styles.userCurrency}>{currency}</Text>
        </GlassCard>

        {/* Goals Summary */}
        {goals.length > 0 && (
          <GlassCard style={styles.goalsCard}>
            <Text style={styles.sectionTitle}>Mục tiêu ({goals.length})</Text>
            {goals.slice(0, 2).map((goal) => {
              const progress = safePercent(goal.currentAmount, goal.targetAmount);
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%`, backgroundColor: goal.color }]}
                    />
                  </View>
                  <Text style={styles.goalPercent}>{Math.round(progress)}%</Text>
                </View>
              );
            })}
          </GlassCard>
        )}

        {/* Dark Mode Toggle */}
        <GlassCard style={styles.toggleCard}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={palette.primary200} />
          <Text style={styles.toggleLabel}>Chế độ tối</Text>
          <Switch
            value={isDark}
            onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
            trackColor={{ true: palette.primary100, false: palette.glass300 }}
            thumbColor={palette.white}
            style={{ marginLeft: 'auto' }}
          />
        </GlassCard>

        {/* Menu Items */}
        <GlassCard style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, idx < menuItems.length - 1 && styles.menuDivider]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={20} color={palette.gray300} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.gray500} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Logout / Danger */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={palette.danger100} />
          <Text style={styles.resetText}>Đăng xuất (Xóa dữ liệu)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg100 },
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 100 },
  profileCard: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.primary100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.white, fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  userName: { color: palette.white, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  userCurrency: { color: palette.gray400, fontSize: fontSize.sm },
  sectionTitle: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.semiBold, marginBottom: spacing.sm },
  goalsCard: { gap: spacing.sm },
  goalItem: { gap: spacing.xs },
  goalTitle: { color: palette.gray300, fontSize: fontSize.sm },
  progressTrack: { height: 6, backgroundColor: palette.bg400, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: borderRadius.full },
  goalPercent: { color: palette.gray400, fontSize: fontSize.xs, textAlign: 'right' },
  toggleCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  toggleLabel: { color: palette.white, fontSize: fontSize.base, fontWeight: fontWeight.medium },
  menuCard: { gap: 0, padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.base },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: palette.glass200 },
  menuLabel: { color: palette.white, fontSize: fontSize.base },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.base,
  },
  resetText: { color: palette.danger100, fontSize: fontSize.sm, fontWeight: fontWeight.medium },
});
