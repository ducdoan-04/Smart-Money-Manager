import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone'>('phone');

  const handleNext = () => {
    navigation.navigate('ResetOTP');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F7', '#FCF8FF', '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#6B6B80" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.description}>
            We will send an OTP verification code to reset{'\n'}your password.
          </Text>

          {/* Methods */}
          <View style={styles.methodsContainer}>
            {/* Email Option */}
            <TouchableOpacity
              style={[styles.methodCard, selectedMethod === 'email' && styles.methodCardActive]}
              onPress={() => setSelectedMethod('email')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#E54B6B', '#7A47F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrapper}
              >
                <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodLabel}>Email</Text>
                <Text style={styles.methodValue}>alesandra.220@gmail.com</Text>
              </View>
            </TouchableOpacity>

            {/* Phone Option */}
            <TouchableOpacity
              style={[styles.methodCard, selectedMethod === 'phone' && styles.methodCardActive]}
              onPress={() => setSelectedMethod('phone')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#E54B6B', '#7A47F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrapper}
              >
                <Ionicons name="call-outline" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodLabel}>Phone number</Text>
                <Text style={styles.methodValue}>+62 8572 1234 6000</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#8A8A9D',
    lineHeight: 24,
    marginBottom: 40,
  },
  methodsContainer: {
    gap: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: 'transparent',
  },
  methodCardActive: {
    borderWidth: 0,
    backgroundColor: '#F0E8F5',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize: 13,
    color: '#8A8A9D',
    fontWeight: '600',
    marginBottom: 4,
  },
  methodValue: {
    fontSize: 15,
    color: '#1E103A',
    fontWeight: '700',
  },
  bottomSection: {
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#7A47F5',
    width: 140,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7A47F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
