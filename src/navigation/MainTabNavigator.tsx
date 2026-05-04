import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';

import { palette, fontSize, fontWeight, borderRadius } from '../theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TransactionListScreen } from '../screens/transactions/TransactionListScreen';
import { BudgetScreen } from '../screens/budget/BudgetScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ITEMS: Array<{
  name: keyof MainTabParamList;
  label: string;
  icon: string;
  activeIcon: string;
}> = [
  { name: 'Home', label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Transactions', label: 'Giao dịch', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'Budget', label: 'Ngân sách', icon: 'wallet-outline', activeIcon: 'wallet' },
  { name: 'Analytics', label: 'Phân tích', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'Profile', label: 'Hồ sơ', icon: 'person-outline', activeIcon: 'person' },
];

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.bg200,
          borderTopColor: palette.glass300,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: palette.primary100,
        tabBarInactiveTintColor: palette.gray500,
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
        },
      }}
    >
      {TAB_ITEMS.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          options={{
            tabBarLabel: item.label,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={(focused ? item.activeIcon : item.icon) as any}
                size={22}
                color={color}
              />
            ),
          }}
        >
          {item.name === 'Home'
            ? () => <HomeScreen />
            : item.name === 'Transactions'
            ? () => <TransactionListScreen />
            : item.name === 'Budget'
            ? () => <BudgetScreen />
            : item.name === 'Analytics'
            ? () => <AnalyticsScreen />
            : () => <ProfileScreen />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
