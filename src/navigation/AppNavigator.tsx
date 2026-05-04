import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { palette } from '../theme';
import { useSettingsStore } from '../store';

// Onboarding
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { RegisterScreen } from '../screens/onboarding/RegisterScreen';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { ForgotPasswordScreen } from '../screens/onboarding/ForgotPasswordScreen';
import { VerifyPhoneScreen } from '../screens/onboarding/VerifyPhoneScreen';
import { VerifyOTPScreen } from '../screens/onboarding/VerifyOTPScreen';
import { ResetOTPScreen } from '../screens/onboarding/ResetOTPScreen';
import { ResetPasswordScreen } from '../screens/onboarding/ResetPasswordScreen';
import { TermsScreen } from '../screens/onboarding/TermsScreen';
import { SetupScreen } from '../screens/onboarding/SetupScreen';

// Main Tab
import { MainTabNavigator } from './MainTabNavigator';

// Transaction Stack Screens
import { AddTransactionScreen } from '../screens/transactions/AddTransactionScreen';

// Budget Stack Screens
// import { AddBudgetScreen } from '../screens/budget/AddBudgetScreen'; // TODO

// Profile Sub-screens
// import { GoalsScreen } from '../screens/profile/GoalsScreen'; // TODO
// import { SettingsScreen } from '../screens/profile/SettingsScreen'; // TODO

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { isOnboarded, loadSettings, isLoading } = useSettingsStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSettings().then(() => setReady(true));
  }, []);

  if (!ready || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg100, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={palette.primary100} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg100 },
          animation: 'fade_from_bottom',
        }}
        initialRouteName={isOnboarded ? 'Main' : 'Splash'}
      >
        {/* ── Onboarding ──────────────── */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="ResetOTP" component={ResetOTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />

        {/* ── Main App ────────────────── */}
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* ── Modal Screens ───────────── */}
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />

        {/* TODO: Add more modal screens here */}
        {/* <Stack.Screen name="AddBudget" component={AddBudgetScreen} options={{ presentation: 'modal' }} /> */}
        {/* <Stack.Screen name="Goals" component={GoalsScreen} /> */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
