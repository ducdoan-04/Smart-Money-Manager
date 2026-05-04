import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, placeholder, value, onChangeText, secureTextEntry }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <View style={styles.inputContent}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#C4C4C4"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {secureTextEntry !== undefined && (
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsSecure(!isSecure)}>
          <Ionicons name={isSecure ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8A9D" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    navigation.navigate('VerifyPhone');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleTerms = () => {
    navigation.navigate('Terms');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F7', '#FCF8FF', '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header / Logo */}
            <View style={styles.header}>
              <Image source={require('../../../assets/logo/Logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Title & Description */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Create an account</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet, consectetur{'\n'}adipisicing elit, sed do eiusmod.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <AuthInput
                label="Full name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
              />
              <AuthInput
                label="Email"
                placeholder="John@email.com"
                value={email}
                onChangeText={setEmail}
              />
              <AuthInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By signing up you are agree to our{' '}
              <Text style={styles.termsLink} onPress={handleTerms}>
                Terms and Service
              </Text>
            </Text>

          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    width: 40,
    height: 40,
  },
  textSection: {
    marginBottom: 40,
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
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    height: 72,
  },
  inputContainerFocused: {
    borderColor: '#B344FF',
  },
  inputContent: {
    flex: 1,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#8A8A9D',
    fontWeight: '600',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
    color: '#1E103A',
    fontWeight: '600',
    padding: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#8A8A9D',
  },
  termsLink: {
    fontWeight: '700',
    color: '#1E103A',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
    paddingTop: 10,
  },
  loginButton: {
    backgroundColor: '#F0E8F5',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  loginText: {
    color: '#6B6B80',
    fontSize: 15,
    fontWeight: '600',
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
