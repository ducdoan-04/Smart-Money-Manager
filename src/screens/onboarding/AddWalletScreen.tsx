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
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CARD_COLORS = [
  { id: 'purple_dark', colors: ['#1E103A', '#1E103A'] },
  { id: 'orange', colors: ['#E54B6B', '#F78E48', '#F3CA2E'] },
  { id: 'purple_light', colors: ['#7A47F5', '#B344FF'] },
  { id: 'red', colors: ['#E53935', '#E35D5B'] },
  { id: 'green', colors: ['#4CAF50', '#81C784'] },
];

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconRight?: string;
  onPress?: () => void;
  flex?: number;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, placeholder, value, onChangeText, iconRight, onPress, flex }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity 
      style={[styles.inputContainer, isFocused && styles.inputContainerFocused, flex ? { flex } : {}]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
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
          editable={!onPress}
          pointerEvents={onPress ? 'none' : 'auto'}
        />
      </View>
      {iconRight && (
        <Ionicons name={iconRight as any} size={20} color="#8A8A9D" />
      )}
    </TouchableOpacity>
  );
};

export const AddWalletScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { username, imageUri } = route.params || {};

  const [walletName, setWalletName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);
  const [isLinked, setIsLinked] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [pickerYear, setPickerYear] = useState(currentYear);

  const handleNext = () => {
    navigation.navigate('Setup', {
      walletName,
      cardNumber,
      cardHolder,
      expiry,
      selectedColor,
      username,
      imageUri,
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
    const formattedYear = pickerYear.toString().slice(-2);
    setExpiry(`${formattedMonth}/${formattedYear}`);
    setIsCalendarVisible(false);
  };

  // Format card number to add spaces
  const displayCardNumber = cardNumber || '-   -   -   -';

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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Add your first wallet</Text>

            {/* Card Preview */}
            <LinearGradient
              colors={selectedColor.colors.length > 1 ? selectedColor.colors : [selectedColor.colors[0], selectedColor.colors[0]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardPreview}
            >
              {selectedColor.id !== 'purple_dark' && (
                <View style={styles.mastercardLogo}>
                  <View style={[styles.circle, styles.circleLeft]} />
                  <View style={[styles.circle, styles.circleRight]} />
                </View>
              )}
              {selectedColor.id !== 'purple_dark' && (
                <Text style={styles.balanceText}>$ 12,000<Text style={styles.balanceDecimals}>.00</Text></Text>
              )}

              <Text style={styles.previewCardNumber}>{displayCardNumber}</Text>

              <View style={styles.previewCardBottom}>
                <View>
                  <Text style={styles.previewLabel}>CARD HOLDER</Text>
                  <Text style={styles.previewValue}>{cardHolder || '-'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.previewLabel}>EXPIRES</Text>
                  <Text style={styles.previewValue}>{expiry || '-'}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Form */}
            <View style={styles.formSection}>
              <AuthInput
                label="Wallet name"
                placeholder="-"
                value={walletName}
                onChangeText={setWalletName}
              />
              <AuthInput
                label="Card number"
                placeholder="- - - -"
                value={cardNumber}
                onChangeText={setCardNumber}
              />
              <AuthInput
                label="Card holder name"
                placeholder="-"
                value={cardHolder}
                onChangeText={setCardHolder}
              />

              <View style={styles.row}>
                <AuthInput
                  label="Expiration date"
                  placeholder="mm/dd"
                  value={expiry}
                  onChangeText={setExpiry}
                  iconRight="chevron-down"
                  onPress={() => setIsCalendarVisible(true)}
                  flex={1.5}
                />
                <View style={{ width: 16 }} />
                <AuthInput
                  label="CVV"
                  placeholder="-"
                  value={cvv}
                  onChangeText={setCvv}
                  flex={1}
                />
              </View>
            </View>

            {/* Color Selector */}
            <Text style={styles.sectionLabel}>Select card color</Text>
            <View style={styles.colorSelectorRow}>
              {CARD_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[styles.colorSwatchWrapper, selectedColor.id === color.id && styles.colorSwatchActive]}
                  onPress={() => setSelectedColor(color)}
                >
                  <LinearGradient
                    colors={color.colors.length > 1 ? color.colors : [color.colors[0], color.colors[0]]}
                    style={styles.colorSwatch}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {selectedColor.id === color.id && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {/* Link Switch */}
            <View style={styles.linkRow}>
              <Switch
                value={isLinked}
                onValueChange={setIsLinked}
                trackColor={{ false: '#EAEAEA', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.linkText}>Link your card</Text>
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

      {/* Calendar Modal */}
      <Modal visible={isCalendarVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                style={[styles.calendarNavBtn, pickerYear <= currentYear && { opacity: 0.5 }]} 
                onPress={() => setPickerYear(y => Math.max(currentYear, y - 1))}
                disabled={pickerYear <= currentYear}
              >
                <Ionicons name="chevron-back" size={20} color="#1E103A" />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{pickerYear}</Text>
              <TouchableOpacity style={styles.calendarNavBtn} onPress={() => setPickerYear(y => y + 1)}>
                <Ionicons name="chevron-forward" size={20} color="#1E103A" />
              </TouchableOpacity>
            </View>

            <View style={styles.monthGrid}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const isPast = pickerYear === currentYear && i < currentMonth;
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.monthCell, isPast && { opacity: 0.3 }]}
                    onPress={() => {
                      if (!isPast) handleMonthSelect(i);
                    }}
                    activeOpacity={isPast ? 1 : 0.7}
                  >
                    <Text style={styles.monthText}>{month}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 24,
  },
  cardPreview: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  mastercardLogo: {
    position: 'absolute',
    top: 24,
    left: 24,
    flexDirection: 'row',
    width: 40,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  circleLeft: {
    opacity: 0.8,
  },
  circleRight: {
    opacity: 0.8,
    marginLeft: -10,
  },
  balanceText: {
    position: 'absolute',
    top: 24,
    right: 24,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  balanceDecimals: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewCardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 'auto',
    marginBottom: 20,
  },
  previewCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 1,
  },
  previewValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
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
  sectionLabel: {
    fontSize: 13,
    color: '#8A8A9D',
    fontWeight: '700',
    marginBottom: 16,
  },
  colorSelectorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  colorSwatchWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  colorSwatchActive: {
    // border applied or distinct shadow. Design shows simple selection by checkmark.
  },
  colorSwatch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#8A8A9D',
    fontWeight: '600',
    marginLeft: 12,
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
    backgroundColor: 'rgba(230, 220, 240, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E103A',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  monthCell: {
    width: '30%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F0E8F5',
  },
  monthText: {
    fontSize: 14,
    color: '#1E103A',
    fontWeight: '600',
  },
});
