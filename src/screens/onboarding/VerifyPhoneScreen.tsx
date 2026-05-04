import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
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

const COUNTRIES = [
  { id: 'ID', name: 'Indonesia', code: '+62', flag: require('../../../assets/flags/Nation=indonesia.png') },
  { id: 'VN', name: 'Vietnam', code: '+84', flag: require('../../../assets/flags/Nation=vietnam.png') },
  { id: 'US', name: 'United States', code: '+1', flag: require('../../../assets/flags/Nation=united_states.png') },
  { id: 'UK', name: 'United Kingdom', code: '+44', flag: require('../../../assets/flags/Nation=united_kingdom.png') },
  { id: 'JP', name: 'Japan', code: '+81', flag: require('../../../assets/flags/Nation=japan.png') },
  { id: 'KR', name: 'South Korea', code: '+82', flag: require('../../../assets/flags/Nation=south_korea.png') },
  { id: 'SG', name: 'Singapore', code: '+65', flag: require('../../../assets/flags/Nation=singapore.png') },
  { id: 'TH', name: 'Thailand', code: '+66', flag: require('../../../assets/flags/Nation=thailand.png') },
  { id: 'AU', name: 'Australia', code: '+61', flag: require('../../../assets/flags/Nation=australia.png') },
];

export const VerifyPhoneScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setPhoneNumber(prev => prev.slice(0, -1));
    } else if (key) {
      if (phoneNumber.length < 15) {
        setPhoneNumber(prev => prev + key);
      }
    }
  };

  const handleNext = () => {
    navigation.navigate('VerifyOTP');
  };

  // Format phone number to match design: "8572 1234 6000"
  const formattedPhone = phoneNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

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

          {/* Inputs Row */}
          <View style={styles.inputRow}>
            {/* Country Selector */}
            <TouchableOpacity style={styles.countrySelector} onPress={() => setIsModalVisible(true)}>
              <View style={styles.flagWrapper}>
                 <Image source={selectedCountry.flag} style={styles.flagIcon} resizeMode="cover" />
              </View>
              <Ionicons name="chevron-down" size={16} color="#1E103A" style={styles.chevron} />
            </TouchableOpacity>

            {/* Phone Input */}
            <View style={styles.phoneInputContainer}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <Text style={styles.phoneValueContainer}>
                <Text style={styles.phonePrefix}>{selectedCountry.code} </Text>
                {phoneNumber ? (
                  <Text style={styles.phoneValue}>{formattedPhone}</Text>
                ) : (
                  <Text style={styles.phonePlaceholder}></Text>
                )}
              </Text>
            </View>
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

      {/* Country Selection Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#1E103A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, selectedCountry.id === item.id && styles.countryItemActive]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={item.flag} style={styles.modalFlagIcon} />
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                  {selectedCountry.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#7A47F5" style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              )}
            />
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
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    height: 72,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    minWidth: 100,
    justifyContent: 'center',
  },
  flagWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  flagIcon: {
    width: '100%',
    height: '100%',
  },
  chevron: {
    marginLeft: 8,
  },
  phoneInputContainer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: 12,
    color: '#8A8A9D',
    fontWeight: '600',
    marginBottom: 4,
  },
  phoneValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePrefix: {
    color: '#C4C4C4',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneValue: {
    fontSize: 18,
    color: '#1E103A',
    fontWeight: '700',
  },
  phonePlaceholder: {
    color: '#C4C4C4',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E103A',
  },
  modalClose: {
    padding: 4,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  countryItemActive: {
    backgroundColor: '#F8F4FF',
  },
  modalFlagIcon: {
    width: 32,
    height: 24,
    borderRadius: 4,
    marginRight: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#1E103A',
    fontWeight: '500',
  },
  countryCode: {
    fontSize: 16,
    color: '#8A8A9D',
    fontWeight: '600',
  },
});
