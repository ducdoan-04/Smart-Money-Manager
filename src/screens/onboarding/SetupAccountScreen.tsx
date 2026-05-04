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
import * as ImagePicker from 'expo-image-picker';

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, placeholder, value, onChangeText }) => {
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

export const SetupAccountScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState<any>(null);

  const handleNext = () => {
    navigation.navigate('AddWallet', {
      username,
      imageUri,
    });
  };

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1.2, 1], // roughly matching the design container box
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri({ uri: result.assets[0].uri });
    }
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header / Logo */}
            <View style={styles.header}>
              <Image source={require('../../../assets/logo/Logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Setup your account</Text>

            {/* Profile Picture Upload */}
            <Text style={styles.sectionLabel}>Profile picture</Text>
            
            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadBox} onPress={handleSelectImage} activeOpacity={0.8}>
                {imageUri ? (
                  <Image source={imageUri} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="person-outline" size={32} color="#C4C4C4" />
                    <Text style={styles.uploadText}>Upload a file or photos</Text>
                    <Text style={styles.uploadSubtext}>*maximum size 2MB</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Floating Camera Button */}
              <TouchableOpacity style={styles.cameraButton} onPress={handleSelectImage}>
                <LinearGradient
                  colors={['#E54B6B', '#7A47F5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cameraGradient}
                >
                  <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <AuthInput
                label="Username"
                placeholder="-"
                value={username}
                onChangeText={setUsername}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#8A8A9D',
    fontWeight: '700',
    marginBottom: 12,
  },
  uploadSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  uploadBox: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#F0E8F5',
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A9D',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#C4C4C4',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: '#7A47F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cameraGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    marginTop: 10,
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
});
