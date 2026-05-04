import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { useTransactionStore, useBudgetStore, useGoalStore } from './src/store';

export default function App() {
  const { loadTransactions } = useTransactionStore();
  const { loadBudgets } = useBudgetStore();
  const { loadGoals } = useGoalStore();

  useEffect(() => {
    // Pre-load all store data after settings are ready
    Promise.all([loadTransactions(), loadBudgets(), loadGoals()]);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
