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

const NUMPAD = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['', '0', 'delete'],
];

export const VerifyOTPScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setOtp(prev => prev.slice(0, -1));
    } else if (key) {
      if (otp.length < 4) {
        setOtp(prev => prev + key);
      }
    }
  };

  const handleNext = () => {
    navigation.navigate('Setup');
  };

  const renderOtpBox = (index: number) => {
    const isFilled = otp.length > index;
    const value = isFilled ? otp[index] : '';

    return (
      <View key={index} style={[styles.otpBox, isFilled && styles.otpBoxFilled]}>
        <Text style={styles.otpText}>{value}</Text>
      </View>
    );
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
          <Text style={styles.title}>Verify identity</Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map(renderOtpBox)}
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Numpad */}
          <View style={styles.numpad}>
            {NUMPAD.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.numpadRow}>
                {row.map((key, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.numpadKey}
                    onPress={() => handleKeyPress(key)}
                    disabled={!key}
                  >
                    {key === 'delete' ? (
                      <Ionicons name="backspace-outline" size={32} color="#1E103A" />
                    ) : (
                      <Text style={styles.numpadText}>{key}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

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
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderWidth: 0,
    backgroundColor: '#F0E8F5',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E103A',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: '#8A8A9D',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E103A',
  },
  numpad: {
    marginBottom: 20,
    gap: 10,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  numpadKey: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadText: {
    fontSize: 32,
    color: '#1E103A',
    fontWeight: '500',
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
