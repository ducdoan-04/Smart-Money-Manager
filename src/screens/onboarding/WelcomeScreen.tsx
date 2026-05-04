import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Save for your\nfuture!',
    description: 'Lorem ipsum dolor sit amet, consectetur\nadipisicing elit, sed do eiusmod.',
    image: require('../../../assets/icons/Illustration-1.png'),
  },
  {
    id: '2',
    title: 'Track your spend\nand income',
    description: 'Lorem ipsum dolor sit amet, consectetur\nadipisicing elit, sed do eiusmod.',
    image: require('../../../assets/icons/Illustration-2.png'),
  },
  {
    id: '3',
    title: 'Analyze your\nspending',
    description: 'Lorem ipsum dolor sit amet, consectetur\nadipisicing elit, sed do eiusmod.',
    image: require('../../../assets/icons/Illustration-3.png'),
  },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (index < SLIDES.length && index >= 0) {
      slidesRef.current?.scrollToIndex({ index });
    } else if (index >= SLIDES.length) {
      navigation.navigate('Register');
    }
  };

  const skip = () => {
    navigation.navigate('Register');
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  // --- SVG Arc Math ---
  // We want an arc that spans from x=0 to x=width, dipping gently.
  // Using a circle with radius = width.
  const circleRadius = width;
  const circleCircumference = 2 * Math.PI * circleRadius;
  // To have the bottom of the circle at y=70, cy = 70 - radius.
  const arcHeight = 80;
  const cx = width / 2;
  const cy = arcHeight - 10 - circleRadius;
  // The visible arc physically spans from 60 deg to 120 deg (60 degrees total).
  const visibleFraction = 60 / 360;
  const progressPercent = (currentIndex + 1) / SLIDES.length;
  // Calculate offset
  const strokeDashoffset = circleCircumference - (circleCircumference * progressPercent * visibleFraction);

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#FFF5F7', '#FCF8FF', '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../../assets/logo/Logo.png')} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity style={styles.skipButton} onPress={skip}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <Animated.FlatList
          data={SLIDES}
          ref={slidesRef}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          paddingTop={15}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
        />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* U-Shaped Arc */}
          <View style={styles.arcContainer}>
            <Svg width={width} height={arcHeight} style={{ transform: [{ scaleX: -1 }] }}>
              <Defs>
                <SvgLinearGradient id="grad" x1="1" y1="0" x2="0" y2="0">
                  <Stop offset="0" stopColor="#B344FF" stopOpacity="1" />
                  <Stop offset="1" stopColor="#FF44C8" stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              {/* Background Grey Track */}
              <Circle
                cx={cx}
                cy={cy}
                r={circleRadius}
                stroke="#EAEAEA"
                strokeWidth={3}
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={circleCircumference * (1 - visibleFraction)}
                strokeLinecap="round"
                rotation="60"
                originX={cx}
                originY={cy}
              />
              {/* Purple/Pink Progress */}
              <Circle
                cx={cx}
                cy={cy}
                r={circleRadius}
                stroke="url(#grad)"
                strokeWidth={5}
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="60"
                originX={cx}
                originY={cy}
              />
            </Svg>
          </View>

          {/* Navigation Controls */}
          <View style={[styles.controls, currentIndex === 0 && { justifyContent: 'center' }]}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={() => scrollTo(currentIndex - 1)}>
                <Ionicons name="arrow-back" size={24} color="#6B6B80" />
              </TouchableOpacity>
            )}

            {currentIndex === SLIDES.length - 1 ? (
              <TouchableOpacity style={styles.registerButton} onPress={() => scrollTo(currentIndex + 1)}>
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.nextButton} onPress={() => scrollTo(currentIndex + 1)}>
                <Ionicons name="arrow-forward" size={24} color="#6B6B80" />
              </TouchableOpacity>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    height: 60,
  },
  logo: {
    width: 36,
    height: 36,
  },
  skipButton: {
    backgroundColor: '#F0E5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    color: '#8A7B99',
    fontSize: 14,
    fontWeight: '500',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    flex: 0.55,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 0.45,
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E103A',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#8A8A9D',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 20,
  },
  arcContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    width: 140,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButton: {
    width: 180,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7A47F5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7A47F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
