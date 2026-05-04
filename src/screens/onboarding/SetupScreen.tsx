import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useSettingsStore } from '../../store';

export const SetupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { setOnboarded } = useSettingsStore();

  const { cardNumber, cardHolder, expiry, selectedColor, username, imageUri } = route.params || {};

  const displayCardNumber = cardNumber || '1823   5232   7453   43';
  const displayHolder = cardHolder || 'Alesandra';
  const displayExpiry = expiry || '04/23';
  const displayColor = selectedColor || { id: 'orange', colors: ['#E54B6B', '#F78E48', '#F3CA2E'] };
  
  const displayUsername = username || 'Alesandra';
  const displayImage = imageUri || require('../../../assets/avatars/avatar-1.jpg');

  const handleExplore = async () => {
    await setOnboarded();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
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

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Text style={styles.title}>Your account is{'\n'}ready to use</Text>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={displayImage} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayUsername}</Text>
              <Text style={styles.profileEmail}>alesandra.220@gmail.com</Text>
            </View>
          </View>

          {/* Card */}
          <LinearGradient
            colors={displayColor.colors.length > 1 ? displayColor.colors : [displayColor.colors[0], displayColor.colors[0]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Top Row */}
            <View style={styles.cardTop}>
              {displayColor.id !== 'purple_dark' && (
                <View style={styles.mastercardLogo}>
                  <View style={[styles.circle, styles.circleLeft]} />
                  <View style={[styles.circle, styles.circleRight]} />
                </View>
              )}
              {displayColor.id !== 'purple_dark' && (
                <Text style={styles.balanceText}>$ 12,000<Text style={styles.balanceDecimals}>.00</Text></Text>
              )}
            </View>

            {/* Card Number */}
            <Text style={styles.cardNumber}>{displayCardNumber}</Text>

            {/* Bottom Row */}
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardValue}>{displayHolder}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>{displayExpiry}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Help Text */}
          <Text style={styles.helpText}>
            *You can add more wallet by pressing add button on{'\n'}homepage and profile menu
          </Text>

        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.exploreButton} onPress={handleExplore}>
            <Text style={styles.exploreText}>Explore</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 40,
    lineHeight: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#F0E8F5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E103A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8A8A9D',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    aspectRatio: 1.586, // standard credit card ratio
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#F78E48',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mastercardLogo: {
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  balanceDecimals: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#8A8A9D',
    lineHeight: 18,
  },
  bottomSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#7A47F5',
    width: 160,
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
  exploreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
