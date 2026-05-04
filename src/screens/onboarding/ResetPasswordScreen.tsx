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
  Modal,
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

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNext = () => {
    setIsModalVisible(true);
  };

  const handleGoToLogin = () => {
    setIsModalVisible(false);
    navigation.navigate('Login');
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#6B6B80" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Title & Description */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Reset password</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet, consectetur{'\n'}adipisicing elit, sed do eiusmod.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <AuthInput
                label="New password"
                placeholder="-"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <AuthInput
                label="Confirm password"
                placeholder="-"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Success Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Password changed</Text>
            <Text style={styles.modalDescription}>
              Your password is successfully changed.{'\n'}Please try to login again.
            </Text>
            <TouchableOpacity style={styles.modalLoginButton} onPress={handleGoToLogin}>
              <Text style={styles.modalLoginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
  bottomSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 32,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(230, 220, 240, 0.85)',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    color: '#8A8A9D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalLoginButton: {
    backgroundColor: '#7A47F5',
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
